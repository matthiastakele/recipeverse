// utils/loadRecipes.ts
import Papa from "papaparse";

// Define a type for the recipe
interface Recipe {
  Title: string;
  Ingredients: string;
  Instructions: string;
  Image_Name: string;
  Cleaned_Ingredients: string[];
}

// Function to parse CSV file
export const loadRecipes = async (csvUrl: string): Promise<Recipe[]> => {
  const response = await fetch(csvUrl);
  const text = await response.text();

  const parsedData = Papa.parse<Recipe>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  console.log("Parsed Recipes: ", parsedData.data); // Log the parsed recipes to check if it's correct

  return parsedData.data;
};
