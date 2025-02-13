import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import "../index.scss";
import styles from "./Home.module.css";

const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const recipesPerPage = 15;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/assets/recipes.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const shuffledRecipes = shuffleArray(result.data);
            setRecipes(shuffledRecipes);
            setFilteredRecipes(shuffledRecipes);
            setLoading(false);
          },
        });
      })
      .catch((error) => {
        console.error("Error loading CSV:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = recipes;
    if (searchQuery.trim() !== "") {
      filtered = recipes.filter((recipe) => {
        const query = searchQuery.toLowerCase();
        if (filterType === "title") {
          return recipe.Title.toLowerCase().includes(query);
        } else if (filterType === "ingredients") {
          return recipe.Cleaned_Ingredients.toLowerCase().includes(query);
        } else if (filterType === "instructions") {
          return recipe.Instructions.toLowerCase().includes(query);
        }
        return false;
      });
    }
    setFilteredRecipes(filtered);
    setCurrentPage(1); // Reset to first page when filtering
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

  const handleRecipeClick = (recipe: any) => {
    window.scrollTo(0, 0); 
    navigate(`/recipe/${recipe.Title.replace(/\s+/g, "-").toLowerCase()}`, {
      state: { recipe },
    });
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
                  src={recipe.Image_Name != "#NAME?" ? `/assets/recipe-images/${recipe.Image_Name}.jpg` : "/assets/cooking-background.jpg"}
                  alt={`/assets/cooking-background.jpg`}
                />
                <h3>{recipe.Title}</h3>
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
