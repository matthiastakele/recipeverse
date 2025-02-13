import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../index.scss";
import styles from "./Recipe.module.css";

const cleanIngredients = (ingredientsStr: string) => {
  const withoutBrackets = ingredientsStr.slice(1, -1);

  const ingredients = withoutBrackets
    .split(/',\s*'/)
    .map((ingredient) => {
      return ingredient.replace(/^'|'$/g, "").trim();
    })
    .filter((ingredient) => ingredient);

  return ingredients;
};

const Recipe: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe } = location.state || {};

  useEffect(() => {
    // Scroll to top when the page is rendered
    window.scrollTo(0, 0);
  }, []);

  // If no recipe is found, redirect to home
  if (!recipe) {
    return (
      <div className={styles.recipePage}>
        <h1>Recipe not found</h1>
        <button onClick={() => navigate("/")}>Return to Recipes</button>
      </div>
    );
  }

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from); // Navigate back to the previous page
    } else {
      navigate("/"); // Default to home if no previous page is recorded
    }
  };

  const ingredients = cleanIngredients(recipe.Cleaned_Ingredients);

  return (
    <div className={styles.recipePage}>
      <h1>{recipe.Title}</h1>
      <img
        src={`/assets/recipe-images/${recipe.Image_Name}.jpg`}
        alt={recipe.Title}
      />

      <div className="mt-6">
        <h2>Ingredients</h2>
        <ul>
          {ingredients.map((ingredient: string, index: number) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <br></br>
        <h2>Instructions</h2>
        {recipe.Instructions.split("\n").map((step: string, index: number) => (
          <p key={index}>{step}</p>
        ))}
      </div>

      <button className="actionButton" onClick={handleBack}> Back to Recipes </button>
    </div>
  );
};

export default Recipe;
