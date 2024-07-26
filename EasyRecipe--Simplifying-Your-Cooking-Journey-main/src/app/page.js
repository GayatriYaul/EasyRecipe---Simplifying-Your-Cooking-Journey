"use client"
import RecipeCard from "@/components/RecipeCard";
import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";

export default function Home() {
  
  const [recipes, setRecipes] = useState([]);
  const [isLiked, setIsLiked] = useState([]);
  const [username, setUsername] = useState(null);
  const [searchRecipe, setSearchRecipe] = useState([]);
  const [recipeName, setRecipeName] = useState("");
  // const []


  useEffect(() => {
    getRecipes();
    setUsername(localStorage.getItem("name"));
    if (localStorage.getItem("username")) {
      getLikes();
    }
  }, []);

  // when search button is cliekd send api req for searching a given receipe in a database (in body we are apssing receipe name )
  const getSearchRecipes = async (e) => {
    console.log(recipeName);
    e.preventDefault();
    // if (recipeName == " " || recipeName == null || recipeName == "") {
    //   alert("Enter Recipe Name");
    //   return;
    // }
    const response = await fetch("api/search-recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipe_name: `%${recipeName}%`,
      }),
    });

    const data = await response.json();
    console.log(data.ingredients);
    setSearchRecipe(data.ingredients);
    // setIsLiked(data);
  };

  // to get a likes receips of specific user from a table (likes) and stroed it in a setIsLiked array 
  const getLikes = async () => {
    const response = await fetch("/api/likes/set-isliked", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("name"),
      }),
    });

    const data = await response.json();

    // to store the receipes id liked by perticular user in a isLiked array 
    setIsLiked(data);
  };

  // get receipes data from receipes table in a db 
  const getRecipes = async () => {
    const response = await fetch("/api/recipes", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setRecipes(data);
    // setFilteredRecipes(data); // Initially, display all recipes
  };

  // runs when search button was clicked 
  // filter function is used on receipes array 
  // it checks if the given search Qurery is present in th perticular receipes description  (include function is used)
  // if it is present then it is added to the filtered array
 // didnt use
    const handleSearch = (e) => {
      e.preventDefault();
    const filtered = recipes.filter((recipe) =>
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  return (
    <div className="container mx-auto">
      <NavBar />
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="mt-1 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Find your favorite recipe
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500 dark:text-gray-400 mb-5">
              Search for your favorite recipe and find out how to make it at
              home.
            </p>
          </div>
        </div>
        <form
          onSubmit={handleSearch}
          className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8"
        >
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search recipes"
              onChange={(e) => setRecipeName(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={getSearchRecipes}
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>

        {/* container to display  recipes */}
        <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 m-10">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/*  map  */}
            {console.log("Serahc Recipes ... ", searchRecipe)}
            {/** if search receipes are there then travles searh Recipe array
             * else travers receipe array 
             */}
            {searchRecipe.length > 0
              ? searchRecipe.map((recipe) => (
                  <RecipeCard
                    recipeName={recipe.recipe_name}
                    description={recipe.description}
                    user_id={recipe.user_id}
                    imageUrl={
                      recipe.image_url
                        ? recipe.image_url
                        : "https://www.allrecipes.com/thmb/fFW1o307WSqFFYQ3-QXYVpnFj6E=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/48727-Mikes-homemade-pizza-DDMFS-beauty-4x3-BG-2974-a7a9842c14e34ca699f3b7d7143256cf.jpg"
                    }
                    cookTime={recipe.cook_time}
                    username={username}
                    recipeId={recipe.recipe_id}
                    isLiked={isLiked}
                    likes={recipe.likes}
                    recipe_by={recipe.recipe_by}
                    recipe_category={recipe.recipe_category}
                  />
                ))
              : recipes.map((recipe) => (
                  <RecipeCard
                    recipeName={recipe.recipe_name}
                    description={recipe.description}
                    user_id={recipe.user_id}
                    imageUrl={
                      recipe.image_url
                        ? recipe.image_url
                        : "https://www.allrecipes.com/thmb/fFW1o307WSqFFYQ3-QXYVpnFj6E=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/48727-Mikes-homemade-pizza-DDMFS-beauty-4x3-BG-2974-a7a9842c14e34ca699f3b7d7143256cf.jpg"
                    }
                    cookTime={recipe.cook_time}
                    username={username}
                    recipeId={recipe.recipe_id}
                    isLiked={isLiked}
                    likes={recipe.likes}
                    recipe_by={recipe.recipe_by}
                    recipe_category={recipe.recipe_category}
                  />
                ))}
          </div>
          </div>
      </div>
    </div>
  );
}

       
