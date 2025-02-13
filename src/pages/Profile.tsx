import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import styles from "./Profile.module.css";
import homeStyles from "./Home.module.css";

const Profile: React.FC = () => {
  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const navigate = useNavigate();

  // Fetch liked recipes from localStorage on page load
  useEffect(() => {
    const storedLikedRecipes = localStorage.getItem("likedRecipes");
    console.log("Stored liked recipes from localStorage:", storedLikedRecipes);  // Debugging line
    if (storedLikedRecipes) {
      setLikedRecipes(JSON.parse(storedLikedRecipes));
    } else {
      setLikedRecipes([]); // Fallback in case no liked recipes are found
    }
  }, []);

  const handleRecipeClick = (recipe: any) => {
    navigate(`/recipe/${recipe.Title.replace(/\s+/g, "-").toLowerCase()}`, {
      state: {
        recipe,
        from: location.pathname, // Pass the current path to the state
      },
    });
  };

  // Toggle like/unlike for a recipe
  const toggleLike = (recipe: any) => {
    setLikedRecipes((prevLikedRecipes) => {
      let updatedLikedRecipes;
      if (prevLikedRecipes.some((likedRecipe) => likedRecipe.Title === recipe.Title)) {
        updatedLikedRecipes = prevLikedRecipes.filter(
          (likedRecipe) => likedRecipe.Title !== recipe.Title
        );
      } else {
        updatedLikedRecipes = [...prevLikedRecipes, recipe];
      }
      
      // Save updated liked recipes to localStorage
      localStorage.setItem("likedRecipes", JSON.stringify(updatedLikedRecipes));  
      return updatedLikedRecipes;
    });
  };

  return (
    <div className={homeStyles.container}>
      <h1 className={styles.profileTitle}>Your Liked Recipes</h1>

      {likedRecipes.length === 0 ? (
        <p className={styles.noRecipesMessage}>
        You have no liked recipes yet.{" "}
        <a onClick={() => navigate("/home")}>Go back to explore recipes</a>
      </p>
      ) : (
        <div className={homeStyles.grid}>
          {likedRecipes.map((recipe, index) => (
            <div key={index} className={homeStyles.recipeCard}>
              <div className={homeStyles.recipeCardContent} onClick={() => handleRecipeClick(recipe)}>
                <img
                  src={`/assets/recipe-images/${recipe.Image_Name}.jpg`}
                  alt={recipe.Title}
                />
                <h3>{recipe.Title}</h3>
              </div>

              <div className={homeStyles.likeButtonWrapper}>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the like button click from triggering recipe click
                    toggleLike(recipe);
                  }}
                  className={homeStyles.likeButton}
                >
                  <FaHeart color="pink" size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
