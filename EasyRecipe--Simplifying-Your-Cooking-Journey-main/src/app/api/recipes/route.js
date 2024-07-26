import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { writeFile } from "fs/promises";

export const GET = async (req, res) => {
  try {
    const recipes = await query({
      query: "SELECT * FROM recipeslist",
      values: [],
    });

    return NextResponse.json(recipes);
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
};
 
export const POST = async (req, res) => {
  try {
    console.log(req);
    const data = await req.formData();
    console.log(data);

    const file = data.get("file");
    if (!file)
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 500 }
      );

      // converts the file into an ArrayBuffer (a low-level binary data buffer). 
    const byteData = await file.arrayBuffer();

    // Buffers are used in Node.js to handle binary data more efficiently.
    const buffer = Buffer.from(byteData); 

    // create path and unique file name
    const path = `./public/${file.name}`;

    // writes the Buffer data to a file at the specified path.
    await writeFile(path, buffer);

    console.log(data.get("title"));
    console.log(data.get("description"));
    console.log(data.get("instructions"));
    console.log(data.get("cook_time"));
    console.log(data.get("servings"));
    console.log(data.get("user_id"));
    console.log(data.get("recipe_category_id"));

    const recipes = await query({
      query:
        "INSERT INTO recipes (title, description, instructions, cook_time, servings, user_id, recipe_category_id,image_url) VALUES (?, ?, ?, ?, ?, ?, ?,?)",
      values: [
        data.get("title"),
        data.get("description"),
        data.get("instructions"),
        data.get("cook_time"),
        data.get("servings"),
        data.get("user_id"),
        data.get("recipe_category_id"),
        `/${file.name}`,
      ],
    });

    // get list of req_ingredients from data
    const req_ingredients = JSON.parse(data.get("req_ingredients"));

    // loop through req_ingredients and insert into req_ingredients table
    for (let i = 0; i < req_ingredients.length; i++) {
      await query({
        query:
          "INSERT INTO req_ingredients (recipe_id, ingredient_id, quantity, measurement_unit) VALUES (?, ?, ?, ?)",
        values: [
          recipes.insertId,
          req_ingredients[i].ingredient_id,
          req_ingredients[i].quantity,
          req_ingredients[i].measurement_unit,
        ],
      });
    }

    return NextResponse.json({ recipes }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
};

// CREATE TABLE `recipes` (
// 	`recipe_id` INT(11) NOT NULL AUTO_INCREMENT,
// 	`title` VARCHAR(100) NOT NULL COLLATE 'latin1_swedish_ci',
// 	`description` TEXT NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
// 	`instructions` TEXT NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
// 	`cook_time` INT(11) NULL DEFAULT NULL,
// 	`servings` INT(11) NULL DEFAULT NULL,
// 	`user_id` INT(11) NULL DEFAULT NULL,
// 	`recipe_category_id` INT(11) NULL DEFAULT NULL,
// 	PRIMARY KEY (`recipe_id`) USING BTREE,
// 	INDEX `user_id` (`user_id`) USING BTREE,
// 	INDEX `recipe_category_id` (`recipe_category_id`) USING BTREE,
// 	CONSTRAINT `recipe_category_id` FOREIGN KEY (`recipe_category_id`) REFERENCES `recipe_category` (`category_id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
// 	CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE RESTRICT ON DELETE CASCADE
// )
// COLLATE='latin1_swedish_ci'
// ENGINE=InnoDB
// AUTO_INCREMENT=6
// ;

// CREATE TABLE `req_ingredients` (
// 	`req_ingredient_id` INT(11) NOT NULL AUTO_INCREMENT,
// 	`recipe_id` INT(11) NULL DEFAULT NULL,
// 	`ingredient_id` INT(11) NULL DEFAULT NULL,
// 	`quantity` DECIMAL(10,2) NULL DEFAULT NULL,
// 	`measurement_unit` VARCHAR(20) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
// 	PRIMARY KEY (`req_ingredient_id`) USING BTREE,
// 	INDEX `recipe_id` (`recipe_id`) USING BTREE,
// 	INDEX `ingredient_id` (`ingredient_id`) USING BTREE,
// 	CONSTRAINT `req_ingredients_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON UPDATE RESTRICT ON DELETE CASCADE,
// 	CONSTRAINT `req_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`) ON UPDATE RESTRICT ON DELETE CASCADE
// )
// COLLATE='latin1_swedish_ci'
// ENGINE=InnoDB
// AUTO_INCREMENT=7
// ;

// CREATE TABLE `recipe_category` (
// 	`category_id` INT(11) NOT NULL AUTO_INCREMENT,
// 	`category_name` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
// 	PRIMARY KEY (`category_id`) USING BTREE
// )
// COLLATE='latin1_swedish_ci'
// ENGINE=InnoDB
// AUTO_INCREMENT=4
// ;
