import { FcLike } from "react-icons/fc";
import { CiHeart } from "react-icons/ci";
import { useState } from "react";
import Link from "next/link";

function MyRecipeCard({ recipeName, description, isLiked, imageUrl, recipeId }) {
  const [hover, setHover] = useState(false);

  return (

    <a
      href="#"
      className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row w-3/4 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <img
        className="object-cover w-96 rounded-t-lg h-96 md:h-auto md:w-64 md:rounded-none md:rounded-l-lg"
        src={imageUrl ? imageUrl : "https://www.allrecipes.com/thmb/fFW1o307WSqFFYQ3-QXYVpnFj6E=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/48727-Mikes-homemade-pizza-DDMFS-beauty-4x3-BG-2974-a7a9842c14e34ca699f3b7d7143256cf.jpg"}
        alt=""
      />
      <div className="flex flex-col justify-between p-4 leading-normal w-full">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {recipeName}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p>
        <Link href={`/recipes/${recipeId}`} className="">
          <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            View</button>
        </Link>
      </div>
      <div className="flex flex-col justify-between p-4 leading-normal">
        <button
          type="button"
          className="w-full focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2.5 py-1.5 mb-8 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          onClick={() => {
            const confirm = window.confirm("Are you sure you want to delete this recipe?");
            if (confirm) {
              fetch(`/api/recipes/delete`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ recipeId }),
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log(data);
                  window.location.reload(); // to relaod window again after deleting a recipe 
                });
            }
          }
          }


        >
          Delete
        </button>
        <button className="flex mt-8 text-center"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {
            isLiked
              || hover ? <FcLike size={25} /> : <CiHeart size={25} />
          }
          <p className="text-gray-700 dark:text-gray-400 text-md ml-1">5</p>
        </button>
      </div>
    </a>

  );
}
export default MyRecipeCard;
