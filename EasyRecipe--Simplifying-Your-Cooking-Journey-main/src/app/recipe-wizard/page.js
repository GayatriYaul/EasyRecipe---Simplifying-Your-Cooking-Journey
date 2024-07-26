"use client";
// Import the necessary components and hooks
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import RecipeCard from "@/components/RecipeCard";

export default function RecipeWizard() {
  const [recipes, setRecipes] = useState([]);
  const [username, setUsername] = useState();
  const [isLiked, setIsLiked] = useState([]);
     
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [selectedCat, setSelectedCat] = useState("Select Category");
  const [checkedCategoryId, setcheckCategoryId] = useState([]);
  const [selectedIng, setSelectedIng] = useState("Select Category");
  const [recipeCategory, setRecipeCategory] = useState([]);
  const [ingredient, setIngredient] = useState([]);
  const [findRecipeIngrediensts, setFindRecipeIngrediensts] = useState([]);
  const [ingredientsCategories, setIngredientsCategories] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // check all button 
  
  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    getRecipes(); // fetch all recipes save in setRecipes
    getRecipeIngredients();  // setIngredientsCategories - fruits , vegetables, spices 
    getRecipeCategories();  // setRecipeCategory - meals, soup , breakfast 
    if (localStorage.getItem("username")) {
      getLikes();
    }
  }, []);

  const handleCheckboxChange = (Ingredient) => {
    if (checkedIngredients.includes(Ingredient.ingredient_id)) {
      setCheckedIngredients(
        checkedIngredients.filter((id) => id !== Ingredient.ingredient_id)
      );
      setcheckCategoryId(
        checkedIngredients.filter((id) => id !== Ingredient.category_id)
      );
    } else {
      setCheckedIngredients([...checkedIngredients, Ingredient.ingredient_id]);
      setcheckCategoryId([...checkedCategoryId, Ingredient.category_id]);
    }
  };

  const handleCheckAll = () => {
    if (selectAll) {
      setCheckedIngredients([]);
      setcheckCategoryId([]);
    } else {
      // Assuming ingredient IDs are unique and can be used as keys
      const allIngredientIds = ingredient.map(
        (ingredient) => ingredient.ingredient_id
      );
      const allCategoryIds = ingredient.map(
        (ingredient) => ingredient.category_id
      );
      setCheckedIngredients(allIngredientIds);
      setcheckCategoryId(allCategoryIds);
    }
    setSelectAll(!selectAll);
  };

  // request to fetch all recipes present from recipeList 
  const getRecipes = async () => {
    const response = await fetch("/api/recipes", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setRecipes(data);
  };


  // fetch - meals , breakfast , soup ...
  const getRecipeCategories = async () => {
    const response = await fetch("/api/recipes/category", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setRecipeCategory(data);
  };


  const getRecipeIngredientsFromIngredientsTablePostReq = async (
    category_id
  ) => {
    const responce = await fetch("/api/ingredients/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category_id: category_id }),
    });

    const data = await responce.json();
    setIngredient(data.ingredients);
    console.log(data);
  };

  const getAllIngredients = async () => {
    const response = await fetch("/api/ingredients/all-ingredients", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setIngredient(data.ingredients);
    console.log(data);
  };

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
    console.log(data);
    setIsLiked(data);
  };

  
  const getRecipesByIngredients_ID = async (ids) => {
    const responce = await fetch("/api/find-recipe/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: [ids] }),
    });
    const data = await responce.json();
    console.log(data.recipes[0]);
    setFindRecipeIngrediensts(data.recipes[0]);
  };

  // return incredients category like vegetable , sipces, fruits , meat, oils
  const getRecipeIngredients = async () => {
    const response = await fetch("/api/ingredients", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    setIngredientsCategories(data.ingredients_category);
  };

  // State to track the dropdown visibility
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownVisible2, setIsDropdownVisible2] = useState(false);

  // Function to toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownVisible(() => !isDropdownVisible);
  };

  // when user cliked on the select category setIsDropdownVisible2 will be true and dropdown will be shown 
  const toggleDropdown2 = () => {
    setIsDropdownVisible2(() => !isDropdownVisible2);
  };
  const handleFindRecipe = () => {
    // if (selectedCat === "Select Category") {
    //   alert("Select Category");
    //   return;
    // }
    // if (selectedIng === "Select Category") {
    //   alert("Select Ingredient Category");
    //   return;
    // }
    if (!checkedIngredients.length > 0) {
      alert("Check in Some Ingredients");
    }
    const checkedIngredientsString = checkedIngredients.join(",");
    const checkedCategoryIdString = checkedCategoryId.join(",");
    console.log(checkedCategoryIdString);
    console.log(checkedIngredientsString);
    console.log(checkedIngredients, selectedIng, selectedCat);
    getRecipesByIngredients_ID(checkedIngredients);
  };
  const handleDropdownItemClick = (itemName) => {
    console.log(`Selected item: ${itemName}`);
    setSelectedIng(itemName);
    getAllIngredients();
    toggleDropdown2();
  };
  const handleDropdownItemClick2 = (itemName2, category_id) => {
    console.log(`Selected item: ${itemName2}`);
    setSelectedIng(itemName2);
    console.log(`Selected item: ${category_id}`);
    getRecipeIngredientsFromIngredientsTablePostReq(category_id);
    toggleDropdown2();
  };

  return (
    <div className="container mx-auto">
      <NavBar />
      <div className="bg-white dark:bg-gray-900 py-6">
        {/* tag line */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl sm:tracking-tight lg:text-4xl">
              Get Recipes by available ingredients
            </p>
          </div>
          <div className="">
            {/* Left Dropdown Button */}

            {/*Right Dropdown Button */}
            <div className="flex flex-col items-center justify-center relative ">
              <label
                htmlFor="category1"
                className="block ml-7 mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Ingredeints Category
              </label>
              <button
                id="dropdownDelayButton"
                className="text-white ml-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
                onClick={toggleDropdown2}
              >
                {selectedIng}{" "}
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {/* Right Dropdown Content */}
              {ingredientsCategories.length > 0 ? (
                <div
                  className={`absolute mt-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 divide-y divide-gray-100 rounded-lg shadow ${
                    isDropdownVisible2 ? "block" : "hidden"
                  }`}
                >
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => handleDropdownItemClick("All")}
                  >
                    All
                  </a>
                  {ingredientsCategories.map((ingredient) => (
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() =>
                        handleDropdownItemClick2(
                          ingredient.category_name,
                          ingredient.category_id
                        )
                      }
                    >
                      {ingredient.category_name}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <h3 class="mb-4 mt-7 font-semibold text-gray-900 dark:text-white">
            Options
          </h3>
          <div class="flex items-center ps-3">
            <input
              id="vue-checkbox-list"
              type="checkbox"
              value=""
              onChange={handleCheckAll}
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <label
              for="vue-checkbox-list"
              class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {selectAll ? "Uncheck All" : "Check All"}
            </label>
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center w-full mt-3 mb-3 sm:mt-0 sm:mb-0 sm:ms-0 sm:me-2">
              {ingredient.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {ingredient.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className="flex items-center bg-white rounded-md shadow-md p-4"
                    >
                      <input
                        id={`checkbox-${ingredient.ingredient_id}`}
                        type="checkbox"
                        checked={checkedIngredients.includes(
                          ingredient.ingredient_id
                        )}
                        onChange={() => handleCheckboxChange(ingredient)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`checkbox-${ingredient.ingredient_id}`}
                        className="ml-3 text-gray-700 text-sm"
                      >
                        {ingredient.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <button
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={handleFindRecipe}
            >
              Find
            </button>
          </div>
        </div>

        {/* Recipe List */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* output from find recipe api:
              {
    "recipes": [
        [
            {
                "recipe_id": 1,
                "recipe_name": "Tomato Soup",
                "description": "A delicious soup made from tomatoes",
                "instructions": "1. Boil tomatoes. 2. Blend them. 3. Add seasoning.",
                "cook_time": 20,
                "servings": 4,
                "recipe_by": "user",
                "recipe_category": "Soup"
            },
            {
                "recipe_id": 6,
                "recipe_name": "test recipe",
                "description": "test description",
                "instructions": "test instructions",
                "cook_time": 10,
                "servings": 2,
                "recipe_by": "user",
                "recipe_category": "Soup"
            },
            {
                "recipe_id": 7,
                "recipe_name": "test recipe",
                "description": "test description",
                "instructions": "test instructions",
                "cook_time": 10,
                "servings": 2,
                "recipe_by": "user",
                "recipe_category": "Soup"
            }
        ],
     
    ]
}
            
            */}
            {console.log(findRecipeIngrediensts)}
            {findRecipeIngrediensts.length > 0 &&
              findRecipeIngrediensts.map((recipe) => (
                <>
                  <RecipeCard
                    key={recipe.recipe_id}
                    recipeId={recipe.recipe_id}
                    imageUrl={
                      recipe.image_url
                        ? recipe.image_url
                        : "https://www.allrecipes.com/thmb/fFW1o307WSqFFYQ3-QXYVpnFj6E=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/48727-Mikes-homemade-pizza-DDMFS-beauty-4x3-BG-2974-a7a9842c14e34ca699f3b7d7143256cf.jpg"
                    }
                    likes={recipe.likes_count}
                    recipeName={recipe.recipe_name}
                    description={recipe.description}
                    cookTime={recipe.cook_time}
                    isLiked={isLiked}
                    recipe_by={recipe.recipe_by}
                    recipe_category={recipe.recipe_category}
                  />
                  {console.log(recipe.recipe_category, " ...... ", selectedCat)}
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
