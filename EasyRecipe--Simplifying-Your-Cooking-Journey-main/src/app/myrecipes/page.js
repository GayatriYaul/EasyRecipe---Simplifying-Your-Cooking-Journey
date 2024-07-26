"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MyRecipeCard from "@/components/MyRecipeCard";
import Link from "next/link";
import { IoMdAdd } from "react-icons/io";
import NavBar from "@/components/NavBar";

function MyRecipe() {
  const [recipes, setRecipes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getRecipes();
  }, []);

  // fetches all recipes 
  const getRecipes = async () => {
    const responce = await fetch("/api/recipes", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    console.log(document.cookie);
    const data = await responce.json();
    setRecipes(data);
    console.log(data);
  };
  return (
    <div>
      <NavBar />
      <div className="bg-white dark:bg-gray-900 py-5">
        {/* tag line */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-7">
          <div className="text-center">
            <p className="mt-1 text-4xl font-bold text-gray-900 dark:text-white sm:text-4xl sm:tracking-tight lg:text-5xl">
              My Recipes
            </p>
          </div>
        </div>
        <form className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 my-5">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search recipes"
              required
            />
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>
        {/* add recipe button to right*/}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 flex justify-end">
          <Link href="/add-recipe">
            <button
              type="button"
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-gree-700 focus:outline-none dark:focus:ring-green-800"
            >
              <IoMdAdd className="inline-block mr-2 " size={18} />
              Add Recipe
            </button>
          </Link>
        </div>

        {/* recipe card is horizontal */}
        <div className="w-full flex flex-col items-center my-5 space-y-5">
          {recipes.map((recipe) => {
            if (localStorage.getItem("name") == recipe.user_id) {
              return (
                <MyRecipeCard
                  recipeId={recipe.recipe_id}
                  recipeName={recipe.recipe_name}
                  description={recipe.description}
                  imageUrl={recipe.image_url}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
export default MyRecipe;
