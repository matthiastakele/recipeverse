import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import "../index.scss";
import styles from "./Home.module.css";
import { FaHeart, FaRegHeart, FaRedo } from "react-icons/fa";
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { TfIdf } from 'natural';

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const recipesPerPage = 15;
  const navigate = useNavigate();
  const location = useLocation();

  const handleRecipeClick = (recipe: any) => {
    navigate(`/recipe/${recipe.Title.replace(/\s+/g, "-").toLowerCase()}`, {
      state: {
        recipe,
        from: location.pathname,
      },
    });
  };

  const shuffleRecipes = () => {
    const shuffled = [...recipes].sort(() => Math.random() - 0.5);
    setRecipes(shuffled);
  };

  // Fetch recipes from localStorage or CSV if not found
  useEffect(() => {
    const storedRecipes = localStorage.getItem("recipes");
    const storedLikedRecipes = localStorage.getItem("likedRecipes");
    const storedPage = localStorage.getItem("currentPage");
    const storedSearchQuery = localStorage.getItem("searchQuery");

    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
      setFilteredRecipes(JSON.parse(storedRecipes)); // Store filtered recipes as well
    } else {
      fetch("/assets/recipes.csv")
        .then((response) => response.text())
        .then((csvText) => {
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              const recipes = result.data;
              setRecipes(recipes);
              setFilteredRecipes(recipes);
              localStorage.setItem("recipes", JSON.stringify(recipes));
            },
          });
        })
        .catch((error) => {
          console.error("Error loading CSV:", error);
        });
    }

    if (storedPage) setCurrentPage(Number(storedPage));
    if (storedSearchQuery) setSearchQuery(storedSearchQuery);
    if (storedLikedRecipes) setLikedRecipes(JSON.parse(storedLikedRecipes));

    setLoading(false); // Set loading to false once data is fetched
  }, []);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
    localStorage.setItem("likedRecipes", JSON.stringify(likedRecipes));
  }, [currentPage, likedRecipes]);

  // TF-IDF search functionality
  useEffect(() => {
    let filtered = recipes;
    if (searchQuery.trim() !== "") {
      const tfidf = new TfIdf();
      const query = searchQuery.toLowerCase().split(" ");
      
      // First, add all documents to TF-IDF
      recipes.forEach((recipe) => {
        const textToAdd =
          filterType === "title"
            ? recipe.Title.toLowerCase()
            : filterType === "ingredients"
            ? recipe.Cleaned_Ingredients.toLowerCase()
            : recipe.Instructions.toLowerCase();
        tfidf.addDocument(textToAdd);
      });

      // Calculate scores for each recipe
      const scoredRecipes = recipes.map((recipe) => {
        const textToSearch =
          filterType === "title"
            ? recipe.Title.toLowerCase()
            : filterType === "ingredients"
            ? recipe.Cleaned_Ingredients.toLowerCase()
            : recipe.Instructions.toLowerCase();

        // Calculate total TF-IDF score for all query terms
        let totalScore = 0;
        query.forEach(term => {
          if (term.length > 0) {
            tfidf.tfidfs(term, (termData) => {
              if (textToSearch.includes(term)) {
                totalScore += termData; // termData is the score here
              }
            });
          }
        });

        return {
          recipe,
          score: totalScore
        };
      });

      // Sort by score and filter out zero scores
      filtered = scoredRecipes
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.recipe);
    }

    setFilteredRecipes(filtered);
    setCurrentPage(1);
    localStorage.setItem("searchQuery", searchQuery);
  }, [searchQuery, filterType, recipes]);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const nextPage = () => {
    window.scrollTo(0, 0);
    if (indexOfLastRecipe < filteredRecipes.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    window.scrollTo(0, 0);
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const toggleLike = async (recipe: any) => {
    setLikedRecipes((prevLikedRecipes) => {
      let updatedLikedRecipes;
      if (prevLikedRecipes.some((likedRecipe) => likedRecipe.Title === recipe.Title)) {
        updatedLikedRecipes = prevLikedRecipes.filter((likedRecipe) => likedRecipe.Title !== recipe.Title);
      } else {
        updatedLikedRecipes = [...prevLikedRecipes, recipe];
      }
      updateLikedRecipesInFirestore(updatedLikedRecipes);
      return updatedLikedRecipes;
    });
  };

  const updateLikedRecipesInFirestore = async (updatedLikedRecipes: any) => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { likedRecipes: updatedLikedRecipes });
    }
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <></>
      ) : (
        <>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search recipes..."
              className={styles.searchBar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className={styles.refreshButton}
              onClick={shuffleRecipes}
            >
              <FaRedo />
            </button>
            <div className={styles.filterButtonContainer}>
              {["title", "ingredients", "instructions"].map((type) => (
                <button
                  key={type}
                  className={`${styles.filterButton} ${filterType === type ? styles.active : ""}`}
                  onClick={() => setFilterType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.grid}>
            {currentRecipes.map((recipe, index) => (
              <div
                key={index}
                className={styles.recipeCard}
                onClick={() => handleRecipeClick(recipe)}
              >
                <img
                  src={`/assets/recipe-images/${recipe.Image_Name}.jpg`}
                  alt={recipe.Title}
                />
                <h3>{recipe.Title}</h3>

                <div className={styles.likeButtonWrapper}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(recipe);
                    }}
                    className={styles.likeButton}
                    aria-label={likedRecipes.some((likedRecipe) => likedRecipe.Title === recipe.Title) ? "Unlike" : "Like"}
                  >
                    {likedRecipes.some((likedRecipe) => likedRecipe.Title === recipe.Title) ? (
                      <FaHeart color="pink" size={24} />
                    ) : (
                      <FaRegHeart color="black" size={24} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.paginationContainer}>
            <button
              className="pagination"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              className="pagination"
              onClick={nextPage}
              disabled={indexOfLastRecipe >= filteredRecipes.length}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;