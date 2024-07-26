"use client";
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Image from "next/image";
// import { get } from "@aptos-labs/ts-sdk";
 
export default function page({ params }) {
  const { recipeId } = params;
  const [recipe, setRecipe] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    setUser(localStorage.getItem("name"));
    getRecipe();
    getIngredients();
    getComments();
  }, []);

  // show all the comments for that recipe 
  const getComments = async () => {
    const responce = await fetch("/api/comments/get-comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_id: recipeId }),
    });
    // Sample responce
    //   {
    //     "comment_id": 4,
    //     "recipe_id": 22,
    //     "user_id": 23,
    //     "comment_text": "Random comment: ",
    //     "comment_date": "2024-04-23T18:58:31.000Z",
    //     "username": "diksha"
    // },
    const data = await responce.json();

    setComments(data);
  };

  const postComment = async () => {
    // const recipe_id = data.recipe_id;
    //     const user_id = data.user_id;
    //     const comment_text = data.comment_text;
    const responce = await fetch("/api/comments/post-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipe_id: recipeId,
        user_id: user,
        comment_text: comment,
      }),
    });

    const data = await responce.json();
    // remove text from input comment box
    setComment("");
    // get all the comments again
    await getComments();
    alert("Comment posted successfully");
  };

  // get ingredients info for that perticular recipe 
  const getIngredients = async () => {
    const responce = await fetch("/api/recipe-ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_id: recipeId }),
    });

    const data = await responce.json();

    setIngredients(data);
  };

  // to get recipe info 
  const getRecipe = async () => {
    const responce = await fetch("/api/recipe-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_id: recipeId }),
    });

    const data = await responce.json();

    // set complte receipe info in a recipe array
    setRecipe(data[0]);
  };

  return (
    <>
      <NavBar />
      <div className="bg-white dark:bg-gray-900 py-5 w-2/4 mx-auto">
        <p className="mt-1 mb-4 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-4xl">
          {recipe.recipe_name}
        </p>
        <p className="mb-3 mt-5 font-normal text-gray-700 dark:text-gray-400">
          {recipe.description}
        </p>

        <div className=" mt-5 ">
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Recipe by: <span className="font-bold">{recipe.recipe_by}</span>
          </p>
          {/* <img
            class="h-auto rounded-lg "
            src=
            {recipe.image_url}
            alt="image description"
          /> */}
          <Image
            src={recipe.image_url}
            alt="recipe image"
            width={500}
            height={500}
            // crop the iamge in a square

            // crop the image to a square
            className="rounded-lg block mx-auto"
          />
        </div>
        {/* display servings and cooking time */}

        <div className="flex flex-row justify-between mt-2">
          <div className="flex flex-col">
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Servings: <span className="font-bold">{recipe.servings}</span>
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Cook Time: <span className="font-bold">{recipe.cook_time}</span>{" "}
              minutes
            </p>
          </div>
          <div className="flex flex-col">
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Recipe Category:{" "}
              <span className="font-bold">{recipe.recipe_category}</span>
            </p>
          </div>
        </div>

        <div className=" ">
          <h2 class="mb-2 mt-4 text-md font-bold text-gray-900 dark:text-white">
            Required Ingredients:
          </h2>
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
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ingredient) => (
                    <tr class="bg-white dark:bg-gray-700">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                        {ingredient.ingredient_name}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {ingredient.category_name}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {ingredient.quantity}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {ingredient.measurement_unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h2 class="mb-2 mt-5 text-xl font-bold text-gray-900 dark:text-white">
            Instructions
          </h2>
          {/* display instructions from the database */}
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {recipe.instructions}
          </p>
        </div>

        <div className="comments">
          <h2 class="mb-2 mt-5 text-xl font-bold text-gray-900 dark:text-white">
            Comments
          </h2>
          <div className="post">
            <textarea
              className="w-full h-24 px-3 py-2 text-base text-gray-700 placeholder-gray-400 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:shadow-outline focus:ring-1 focus:ring-blue-500"
              name="comment"
              id="comment"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={postComment}
              >
                Post
              </button>
            </div>
          </div>

          {comments.map((comment) => (
            <div class="block p-6 mt-3 bg-white border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700">
              <div class="flex items-center justify-between mb-2">
                <h5 class="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                  {comment.username}
                </h5>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {comment.comment_date}
                </p>
              </div>
              <p class="font-normal text-gray-700 dark:text-gray-400">
                {comment.comment_text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
