import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import styles from "./Profile.module.css";
import homeStyles from "./Home.module.css";

const Profile: React.FC = () => {
  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const navigate = useNavigate();

  // Fetch liked recipes from localStorage on page load
  useEffect(() => {
    const storedLikedRecipes = localStorage.getItem("likedRecipes");
    if (storedLikedRecipes) {
      setLikedRecipes(JSON.parse(storedLikedRecipes));
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
      if (prevLikedRecipes.some((likedRecipe) => likedRecipe.Title === recipe.Title)) {
        const updatedLikedRecipes = prevLikedRecipes.filter(
          (likedRecipe) => likedRecipe.Title !== recipe.Title
        );
        localStorage.setItem("likedRecipes", JSON.stringify(updatedLikedRecipes)); // Save to localStorage
        return updatedLikedRecipes;
      } else {
        const updatedLikedRecipes = [...prevLikedRecipes, recipe];
        localStorage.setItem("likedRecipes", JSON.stringify(updatedLikedRecipes)); // Save to localStorage
        return updatedLikedRecipes;
      }
    });
  };

  return (
    <div className={homeStyles.container}>
      {/* Profile Page Title */}
      <h1 className={styles.profileTitle}>Your Liked Recipes</h1>

      {/* Display recipes */}
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

              {/* Like Button outside recipeCardContent */}
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
