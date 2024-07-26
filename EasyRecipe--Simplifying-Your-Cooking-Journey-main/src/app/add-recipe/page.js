"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";

export default function AddRecipe() {
  const router = useRouter();

  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [servings, setServings] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [recipeImage, setRecipeImage] = useState("");

  // to show availabe recipe Categroy in a array 
  const [recipeCategory, setRecipeCategory] = useState([]);
  // user entered - selected recipe category 
  const [selectedRecipeCategory, setSelectedRecipeCategory] = useState("");

  // to show availabe recipe ingredientsCategories in a array
  const [ingredientsCategories, setIngredientsCategories] = useState([]);
  // to show availabe recipe ingredients with respcet to selected 
  //ingredientsCategories in a array
  const [ingredients, setIngredients] = useState([]);  
  // user entered - selected recipe ingredients categiry
  const [selectedIngridentCategory, setSelectedIngridentCategory] =
    useState("");
    // user entered - selected recipe ingredients
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [recipeIngredientsTable, setRecipeIngredientsTable] = useState([]);

  useEffect(() => {

      // soup , breakfast etc 
      // useState - RecipeCategory
    getRecipeCategories();

   // to show availabe recipe ingredientsCategories in a array
   // vegetables, fruits , spices 
   // useState -  IngredientsCategories
    getRecipeIngredients();
  }, []);

  const handleSubmit = async () => {
    // validate input
    if (recipeName === "") {
      alert("Please enter a recipe name");
      return;
    }
    if (description === "") {
      alert("Please enter a description");
      return;
    }
    if (instructions === "") {
      alert("Please enter instructions");
      return;
    }
    if (servings === "") {
      alert("Please enter servings");
      return;
    }
    if (selectedRecipeCategory === "") {
      alert("Please select a recipe category");
      return;
    }
    if (recipeIngredientsTable.length === 0) {
      alert("Please add ingredients");
      return;
    }

    // sample input
    // input:
    // {
    //     "title": "test recipe",
    //     "description": "test description",
    //     "instructions": "test instructions",
    //     "cook_time": 10,
    //     "servings": 2,
    //     "user_id": 1,
    //     "recipe_category_id": 1,
    //     "req_ingredients": [
    //         {
    //             "ingredient_id": 1,
    //             "quantity": 1,
    //             "measurement_unit": "cup"
    //         },
    //         {
    //             "ingredient_id": 2,
    //             "quantity": 2,
    //             "measurement_unit": "cup"
    //         }
    //     ]
    // }

    const req_ingredients = recipeIngredientsTable.map((ingredient) => ({
      ingredient_id: ingredient.ingredient_id,
      quantity: ingredient.quantity,
      measurement_unit: ingredient.unit,
    }));

    // const data = {
    //   title: recipeName,
    //   description: description,
    //   instructions: instructions,
    //   cook_time: cookTime,
    //   servings: servings,
    //   user_id: localStorage.getItem("userId"),
    //   recipe_category_id: selectedRecipeCategory,
    //   req_ingredients: req_ingredients,
    // };

    const formData = new FormData();
    formData.set("title", recipeName);
    formData.set("description", description);
    formData.set("instructions", instructions);
    formData.set("cook_time", cookTime);
    formData.set("servings", servings);
    formData.set("user_id", localStorage.getItem("name"));
    formData.set("recipe_category_id", selectedRecipeCategory);
    formData.set("req_ingredients", JSON.stringify(req_ingredients));
    formData.set("file", recipeImage);

    
    const response = await fetch("/api/recipes", {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();
    console.log(responseData);

    if (response.status === 201) {
      alert("Recipe added successfully");
      router.push("/");
    }

    if (response.status === 500) {
      alert(responseData.message);
    }
  };

  // to show availbe incredients ctegroy 
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

  // soup , breakfast etc 
  const getRecipeCategories = async () => {
    const response = await fetch("/api/recipes/category", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data); 
    setRecipeCategory(data);
  };

  // sending category id in a request and it will resopsne
  // all the incredients respct to the given cateogry
  const getIngredients = async (category_id) => {
    const response = await fetch("/api/ingredients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category_id }),
    });
    const data = await response.json();
    console.log(data);
    setIngredients(data.ingredients);
  };

  // soup , breakfast , meal
  const handleRecipeCategoryChange = (e) => {
    setSelectedRecipeCategory(e.target.value);
  };

  // spices, vegetables, fruits 
  const handleCategoryChange = (e) => {

    // api call to fetch all incredents belonging to the given cateogry
    getIngredients(e.target.value);
    // set selected category as the text of the selected option
    const selectedCategoryText = e.target.options[e.target.selectedIndex].text;
    setSelectedIngridentCategory(() => selectedCategoryText);
  };

  const handleRecipeNameChange = (e) => {
    setRecipeName(() => e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(() => e.target.value);
  };

  const handleInstructionsChange = (e) => {
    setInstructions(() => e.target.value);
  };

  const handleServingsChange = (e) => {
    setServings(() => e.target.value);
  };

  // when add incredients button will clicekd 
  const handleAddIngredient = (e) => {
    e.preventDefault();

    // validate input
    if (selectedIngridentCategory === "") {
      alert("Please select a category");
      return;
    }
    if (selectedIngredient === "") {
      alert("Please select an ingredient");
      return;
    }
    if (quantity === "") {
      alert("Please enter a quantity");
      return;
    }
    if (unit === "") {
      alert("Please select a unit");
      return;
    }

    setRecipeIngredientsTable([
      ...recipeIngredientsTable,
      {
        ingredient_id: ingredients.find(
          (ingredient) => ingredient.name === selectedIngredient
        ).ingredient_id,

        ingredient_name: selectedIngredient,
        ingredient_category: selectedIngridentCategory,
        quantity: quantity,
        unit: unit,
      },
    ]);

    console.log(recipeIngredientsTable);

    // clear input
    const ingredientsForm = document.getElementById("ingredients-form");
    ingredientsForm.reset();
    setSelectedIngridentCategory("");
    setSelectedIngredient("");
    setQuantity("");
    setUnit("");
  };

  return (
    <>
      <NavBar />
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="py-10 px-28">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Add Recipe
              </h1>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="recipeName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Recipe Name
                  </label>
                  <input
                    value={recipeName}
                    onChange={handleRecipeNameChange}
                    type="text"
                    name="recipeName"
                    id="recipeName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter recipe name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    name="description"
                    id="description"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 h-20 resize-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter recipe description"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="instructions"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Instructions
                  </label>
                  <textarea
                    value={instructions}
                    onChange={handleInstructionsChange}
                    name="instructions"
                    id="instructions"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 h-40 resize-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter recipe instructions"
                    required
                  />
                </div>
                <div>
                  <label
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    for="file_input"
                  >
                    Upload file
                  </label>

                  <div class="flex items-center justify-center w-full">
                    <label
                      for="dropzone-file"
                      class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div class="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span class="font-semibold">Click to upload</span> or
                          drag and drop
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        class="hidden"
                        onChange={(e) => {
                          setRecipeImage(e.target.files?.[0]);
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex flex-row space-x-4 justify-center w-full">
                  <div className="flex flex-col flex-grow">
                    <label
                      htmlFor="category1"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Recipe Category
                    </label>
                    <select
                      id="category1"
                      name="category1"
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                      onChange={(e) => handleRecipeCategoryChange(e)}
                    >
                      <option value="">Select a Recipe Category</option>
                      {recipeCategory.map((category) => (
                        <option
                          value={category.category_id}
                          key={category.category_id}
                        >
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-grow">
                    <label
                      htmlFor="servings"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Servings
                    </label>
                    <input
                      value={servings}
                      onChange={handleServingsChange}
                      type="text"
                      name="servings"
                      id="servings"
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter servings"
                      required
                    />
                  </div>
                  <div className="flex-grow">
                    <label
                      htmlFor="cook"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Cooking Time
                    </label>
                    <input
                      value={cookTime}
                      onChange={(e) => {
                        setCookTime(e.target.value);
                      }}
                      type="text"
                      name="cook"
                      id="cook"
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter cook time"
                      required
                    />
                  </div>
                </div>

                <form className="w-full" action="#" id="ingredients-form">
                  <div className="flex flex-row justify-around flex-grow">
                    <div>
                      <label
                        htmlFor="category"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Ingredients Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                        onChange={(e) => handleCategoryChange(e)}
                      >
                        <option value="">Select a category</option>
                        {ingredientsCategories.map((category) => (
                          <option value={category.category_id}>
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="ingredients"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Ingredients
                      </label>
                      <select
                        id="ingredients"
                        name="ingredients"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                        onChange={(e) =>
                          setSelectedIngredient(
                            e.target.options[e.target.selectedIndex].text
                          )
                        }
                      >
                        <option value="">Select an ingredient</option>
                        {ingredients.map((ingredient) => (
                          <option value={ingredient.ingredient_id}>
                            {ingredient.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="quantity"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter quantity"
                        required
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="unit"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Unit
                      </label>
                      <select
                        id="unit"
                        name="unit"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                        onChange={(e) =>
                          setUnit(e.target.options[e.target.selectedIndex].text)
                        }
                        selected={unit}
                      >
                        <option value="">Select a unit</option>
                        <option value="eggs">Teaspoon</option>
                        <option value="bread">cup</option>
                        <option value="milk">grams</option>
                        <option value="chicken">units</option>
                      </select>
                    </div>
                    <div className="flex flex-col justify-end">
                      <button
                        type="button"
                        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={handleAddIngredient}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </form>

                <label
                  htmlFor="ingredients"
                  className="block text-sm font-medium text-gray-900 dark:text-white text-center"
                >
                  Ingredients List
                </label>

                <div className="flex flex-row space-x-4 justify-center">
                  <div class="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" class="px-6 py-3">
                            Ingredient
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Category
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Quantity
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Unit
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recipeIngredientsTable.map((ingredient) => (
                          <tr class="bg-white dark:bg-gray-700">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                              {ingredient.ingredient_name}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {ingredient.ingredient_category}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {ingredient.quantity}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {ingredient.unit}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <span
                                class="font-medium text-red-600 dark:text-red-500 hover:underline"
                                onClick={() => {
                                  // ask user to confirm deletion
                                  if (
                                    !confirm(
                                      "Are you sure you want to delete this ingredient?"
                                    )
                                  ) {
                                    return;
                                  }
                                  const newRecipeIngredientsTable =
                                    recipeIngredientsTable.filter(
                                      (item) =>
                                        item.ingredient_name !==
                                        ingredient.ingredient_name
                                    );
                                  setRecipeIngredientsTable(
                                    newRecipeIngredientsTable
                                  );
                                }}
                              >
                                Delete
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex flex-row justify-end space-x-4">
                  <button
                    type="button"
                    className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    onClick={handleSubmit}
                  >
                    Save Recipe
                  </button>
                  <Link href="/">
                    <button
                      type="button"
                      className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    >
                      Cancel
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
