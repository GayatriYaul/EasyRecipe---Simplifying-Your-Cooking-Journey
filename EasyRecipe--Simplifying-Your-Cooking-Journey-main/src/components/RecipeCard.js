"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import Image from "next/image";
import { CiHeart } from "react-icons/ci";

// Componet which accept props from home page and display recepipe details in a 
// receipe card 
// it hadnles only liked by sepcific user (login) and truncate description functio n

export default function RecipeCard({
  recipeName,
  description,
  imageUrl,
  cookTime,
  recipeId,
  likes,
  recipe_category,
  recipe_by,
  username,
  user_id,
  isLiked = [],
  posted_on,
}) {
  const [isLiked2, setIsLiked] = useState(false);

  //Whenever the list of liked recipes (isLiked) or the recipe ID (recipeId) changes, useEffect will do a check.
  //IsLiked is array which contain receipe_id like by specific user whenevr isLiked or receipe_id change useEffect run and set the value to true
  // it matches current receipe id with receipe id present in a isLiked array 
  useEffect(() => {
    setIsLiked(
      isLiked.some((likedRecipe) => likedRecipe.recipe_id === recipeId)
    );
  }, [isLiked, recipeId]);

  // store like count of the given receipe 
  const [localLikes, setLocalLikes] = useState(likes);

  // which lke button will be clicked change localLikes + 1
  function UpdateLocalLikes() {
    // if user is logged in 
    if (localStorage.getItem("username")) {
      setLocalLikes((prev) => prev + 1);
      getLikes();
    } else {
      alert("You need to login to like the post");
    }
  }

  // sending receipeid and userid to the liked table in a db 
  // to insert a liked count i na table 
  async function getLikes() {
    if (username !== null) {
      const response = await fetch("/api/likes/set-likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipe_id: recipeId,
          user_id: localStorage.getItem("name"),
        }),
      });

      const data = await response.json();
      console.log(data);
      if (
        data.message === "Something went wrong User has already liked the post"
      ) {
        setIsLiked(true);
      }
      setIsLiked(true);
    }
  }

  // Logic to truncate description if it exceeds 15 words
  let truncatedDescription = description;
  if (description.split(" ").length > 15) {
    truncatedDescription =
      description.split(" ").slice(0, 15).join(" ") + " ......";
  }

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <Image
          width={400}
          height={200}
          className="rounded-t-lg max h-80"
          src={imageUrl}
          alt={recipeName}
        />
      </a>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {recipeName}
          </h5>
        </a>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {truncatedDescription}
        </p>
        <hr className="my-5" />
        <div className="flex flex-row justify-between mt-1 text-sm">
          <div className="flex flex-col">
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Recipe by: <span className="font-bold">{recipe_by}</span>
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Cook Time: <span className="font-bold">{cookTime} minutes</span>
            </p>
          </div>
          <div className="flex flex-col">
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Category: <span className="font-bold">{recipe_category}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center mt-2">
          <Link href="/recipes/[id]" as={`/recipes/${recipeId}`}>
            <button
              href="#"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >        
              Read more
              <svg
                className="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </Link>
          <button
            type="button"
            onClick={() =>
              !isLiked2
                ? UpdateLocalLikes()
                : alert("You have already liked the post")
            }
            className="inline-flex items-center ml-3 px-3 py-2 text-sm font-medium text-center text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-blue-800"
          >
            {isLiked2 ? (
              <FaHeart className="text-red-500" size={22} />
            ) : (
              <CiHeart className="text-red-500" size={22} />
            )}
            <span className="ml-1 text-gray-700 dark:text-gray-400">
              {localLikes}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
