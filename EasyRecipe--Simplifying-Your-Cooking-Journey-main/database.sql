-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2024 at 09:48 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `recipe_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `FindRecipesByIngredients` (IN `ingredientIDs` VARCHAR(255))   BEGIN
    SET @query = CONCAT('
        SELECT
            r.recipe_id,
            r.title AS recipe_name,
r.image_url,
            r.description,
            r.instructions,
            r.cook_time,
            r.servings,
            u.username AS recipe_by,
            rc.category_name AS recipe_category
        FROM
            recipes r
            LEFT JOIN users u ON r.user_id = u.user_id
            LEFT JOIN recipe_category rc ON r.recipe_category_id = rc.category_id
            LEFT JOIN req_ingredients ri ON r.recipe_id = ri.recipe_id
        WHERE
            ri.ingredient_id IN (', ingredientIDs, ')
        GROUP BY
            r.recipe_id
    ');
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetComments` (IN `recipeID` INT)   BEGIN
    SELECT
        c.comment_id,
        c.comment_text,
        c.comment_date,
        u.username AS commented_by
    FROM
        comments c
        LEFT JOIN users u ON c.user_id = u.user_id
    WHERE
        c.recipe_id = recipeID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetRecipesByIngredients` (IN `ingredient_ids` TEXT)   BEGIN
    DECLARE ingredientCount INT;
    DECLARE recipeCount INT;
    DECLARE recipe_id INT;
    DECLARE ingredient_id INT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur1 CURSOR FOR SELECT DISTINCT ingredient_id FROM req_ingredients WHERE FIND_IN_SET(ingredient_id, ingredient_ids);
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    CREATE TEMPORARY TABLE temp_recipes AS SELECT DISTINCT recipe_id FROM req_ingredients WHERE FIND_IN_SET(ingredient_id, ingredient_ids);

    OPEN cur1;
    read_loop: LOOP
        FETCH cur1 INTO ingredient_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        SELECT COUNT(*) INTO ingredientCount FROM req_ingredients WHERE recipe_id IN (SELECT recipe_id FROM temp_recipes) AND FIND_IN_SET(ingredient_id, ingredient_ids);
        SELECT COUNT(*) INTO recipeCount FROM temp_recipes;

        IF ingredientCount = recipeCount THEN
            DELETE FROM temp_recipes WHERE recipe_id NOT IN (SELECT recipe_id FROM req_ingredients WHERE FIND_IN_SET(ingredient_id, ingredient_ids));
        END IF;
    END LOOP;
    CLOSE cur1;

    SELECT * FROM recipes WHERE recipe_id IN (SELECT recipe_id FROM temp_recipes);
    DROP TEMPORARY TABLE IF EXISTS temp_recipes;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetRequiredIngredients` (IN `recipeID` INT)   SELECT
        i.ingredient_id,
        ri.recipe_id,
        i.name AS ingredient_name,
        i.category_id,
        ic.category_name AS category_name,
        ri.quantity,
        ri.measurement_unit
    FROM
        req_ingredients ri
    JOIN
        ingredients i ON ri.ingredient_id = i.ingredient_id
    JOIN
        ingredients_category ic ON i.category_id = ic.category_id
    WHERE
        ri.recipe_id = recipeID$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `RecipeInfo` (IN `recipeID` INT)   BEGIN
    SELECT
        r.recipe_id AS recipe_id,
        r.title AS recipe_name,
r.image_url AS image_url,
        r.description AS description,
        r.instructions AS instructions,
        r.cook_time AS cook_time,
        r.servings AS servings,
        u.username AS recipe_by,
        rc.category_name AS recipe_category,
        COUNT(l.like_id) AS likes
    FROM
        recipes r
        LEFT JOIN users u ON r.user_id = u.user_id
        LEFT JOIN recipe_category rc ON r.recipe_category_id = rc.category_id
        LEFT JOIN likes l ON r.recipe_id = l.recipe_id
    WHERE
        r.recipe_id = recipeID
    GROUP BY
        r.recipe_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `recipe_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `comment_text` text DEFAULT NULL,
  `comment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `recipe_id`, `user_id`, `comment_text`, `comment_date`) VALUES
(4, 23, 30, 'mast chai', '2024-04-24 05:46:19'),
(5, 24, NULL, 'loved it\n', '2024-04-24 18:52:32'),
(6, 38, NULL, 'you guys will love it', '2024-04-25 03:35:08'),
(7, 38, 31, 'you will love it\n', '2024-04-25 03:51:04');

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `ingredient_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`ingredient_id`, `name`, `category_id`) VALUES
(1, 'Salt', 1),
(2, 'Black Pepper', 1),
(3, 'Cumin', 1),
(4, 'Paprika', 1),
(5, 'Coriander', 1),
(6, 'Turmeric', 1),
(7, 'Ginger', 1),
(8, 'Cinnamon', 1),
(9, 'Cloves', 1),
(10, 'Chili Powder', 1),
(11, 'Mustard Powder', 1),
(12, 'Cardamom', 1),
(13, 'Fennel Seeds', 1),
(14, 'Oregano', 1),
(15, 'Rosemary', 1),
(16, 'Basil', 1),
(17, 'Bay Leaves', 1),
(18, 'Carrot', 2),
(19, 'Tomato', 2),
(20, 'Potato', 2),
(21, 'Onion', 2),
(22, 'Garlic', 2),
(23, 'Bell Pepper', 2),
(24, 'Spinach', 2),
(25, 'Zucchini', 2),
(26, 'Eggplant', 2),
(27, 'Cabbage', 2),
(28, 'Cauliflower', 2),
(29, 'Mushroom', 2),
(30, 'Green Beans', 2),
(31, 'Asparagus', 2),
(32, 'Celery', 2),
(33, 'Lettuce', 2),
(34, 'Kale', 2),
(35, 'Radish', 2),
(36, 'Pumpkin', 2),
(37, 'Sweet Potato', 2),
(38, 'Turnip', 2),
(39, 'Artichoke', 2),
(40, 'Leek', 2),
(41, 'Scallion', 2),
(42, 'Beetroot', 2),
(43, 'Radicchio', 2),
(44, 'Swiss Chard', 2),
(45, 'Watercress', 2),
(46, 'Brussels Sprouts', 2),
(47, 'Apple', 3),
(48, 'Banana', 3),
(49, 'Orange', 3),
(50, 'Strawberry', 3),
(51, 'Blueberry', 3),
(52, 'Raspberry', 3),
(53, 'Grapes', 3),
(54, 'Watermelon', 3),
(55, 'Pineapple', 3),
(56, 'Mango', 3),
(57, 'Peach', 3),
(58, 'Pear', 3),
(59, 'Cherry', 3),
(60, 'Kiwi', 3),
(61, 'Plum', 3),
(62, 'Lemon', 3),
(63, 'Lime', 3),
(64, 'Milk', 4),
(65, 'Butter', 4),
(66, 'Cheese', 4),
(67, 'Yogurt', 4),
(68, 'Cream', 4),
(69, 'Eggs', 4),
(70, 'Sour Cream', 4),
(71, 'Heavy Cream', 4),
(72, 'Cottage Cheese', 4),
(73, 'Whipped Cream', 4),
(74, 'Condensed Milk', 4),
(75, 'Evaporated Milk', 4),
(76, 'Half-and-Half', 4),
(77, 'Cream Cheese', 4),
(78, 'Ricotta Cheese', 4),
(79, 'Parmesan Cheese', 4),
(80, 'Feta Cheese', 4),
(81, 'Beef', 5),
(82, 'Chicken', 5),
(83, 'Pork', 5),
(84, 'Lamb', 5),
(85, 'Turkey', 5),
(86, 'Duck', 5),
(87, 'Goose', 5),
(88, 'Veal', 5),
(89, 'Bacon', 5),
(90, 'Sausage', 5),
(91, 'Ham', 5),
(92, 'Salami', 5),
(93, 'Pepperoni', 5),
(94, 'Venison', 5),
(95, 'Rabbit', 5),
(96, 'Quail', 5),
(97, 'Olive Oil', 6),
(98, 'Vegetable Oil', 6),
(99, 'Coconut Oil', 6),
(100, 'Canola Oil', 6),
(101, 'Sunflower Oil', 6),
(102, 'Sesame Oil', 6),
(103, 'Peanut Oil', 6),
(104, 'Corn Oil', 6),
(105, 'Avocado Oil', 6),
(106, 'Grapeseed Oil', 6),
(107, 'Walnut Oil', 6),
(108, 'Flaxseed Oil', 6),
(109, 'Safflower Oil', 6),
(110, 'Truffle Oil', 6),
(111, 'Cold Water', 7),
(112, 'Warm Water', 7),
(113, 'Lentils', 8),
(114, 'Black Lentils (Urad Dal)', 8),
(115, 'Red Lentils (Masoor Dal)', 8),
(116, 'Green Lentils (Puy Lentils)', 8),
(117, 'Brown Lentils', 8),
(118, 'Yellow Lentils (Moong Dal)', 8),
(119, 'Split Yellow Lentils (Toor Dal)', 8),
(120, 'French Lentils (Lentilles du Puy)', 8),
(121, 'Beluga Lentils', 8),
(122, 'Coral Lentils', 8),
(123, 'Spanish Pardina Lentils', 8),
(124, 'Black-eyed Peas (Lobia)', 8),
(125, 'Chickpeas (Garbanzo Beans)', 8);

-- --------------------------------------------------------

--
-- Table structure for table `ingredients_category`
--

CREATE TABLE `ingredients_category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `ingredients_category`
--

INSERT INTO `ingredients_category` (`category_id`, `category_name`) VALUES
(1, 'Spices'),
(2, 'Vegetables'),
(3, 'Fruits'),
(4, 'Dairy'),
(5, 'Meat'),
(6, 'Oils'),
(7, 'Water'),
(8, 'lentils');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `like_id` int(11) NOT NULL,
  `recipe_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `liked_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`like_id`, `recipe_id`, `user_id`, `liked_date`) VALUES
(4, 22, 26, '2024-04-24 05:43:31'),
(5, 23, 26, '2024-04-24 05:43:41'),
(6, 23, 27, '2024-04-24 05:45:16'),
(7, 24, 27, '2024-04-24 05:45:19'),
(8, 24, 30, '2024-04-24 21:22:44'),
(9, 22, 30, '2024-04-24 21:22:45'),
(10, 22, 31, '2024-04-25 03:35:41');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `recipe_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  `cook_time` int(11) DEFAULT NULL,
  `servings` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `recipe_category_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`recipe_id`, `title`, `description`, `instructions`, `cook_time`, `servings`, `user_id`, `recipe_category_id`, `image_url`) VALUES
(22, 'Maggie', 'a simple 2 minute snack', 'Sure, here are the steps to prepare Maggi noodles:\n\n1. Boil water in a pan. You can add a few drops of oil and a pinch of salt to the water to prevent the noodles from sticking together.\n\n2. Once the water is boiling, break the Maggi noodle cake into four parts and add it to the boiling water.\n\n3. Let the noodles cook for about 2 minutes. Stir occasionally to ensure they cook evenly.\n\n4. While the noodles are cooking, open the Maggi tastemaker packet and keep it aside.\n\n5. After 2 minutes, add the Maggi tastemaker to the noodles. Stir well to ensure the tastemaker mixes evenly with the noodles.\n\n6. Let the noodles cook for another 1-2 minutes, or until the water has evaporated and the noodles are cooked to your desired consistency.\n\n7. Once the noodles are ready, turn off the heat and let them sit for a minute to cool down slightly.\n\n8. Serve the Maggi noodles hot, garnished with chopped vegetables or herbs if desired. Enjoy!', 5, 2, 28, 5, '/maggie.jpg'),
(23, 'Chai', 'Favourite Indian Beverage', 'Boil water: In a saucepan, bring water to a boil.\r\n\r\nAdd spices (optional): If you\'re using spices, add them to the boiling water. Common spices used in chai include crushed cardamom pods, cinnamon sticks, ginger slices, and cloves. Let the spices simmer in the water for a few minutes to infuse their flavors.\r\n\r\nAdd tea leaves: Add black tea leaves or tea bags to the water. Use about 1-2 teaspoons of tea leaves per cup of water, depending on how strong you like your chai. Let the tea leaves simmer in the water for a few minutes.\r\n\r\nAdd milk: Add milk to the saucepan. Use about half the amount of milk as water. For example, if you used 1 cup of water, add 1/2 cup of milk. Adjust the amount of milk based on your preference for the richness of the chai.\r\n\r\nSweeten (optional): Add sugar to taste if desired. Stir the chai to dissolve the sugar.\r\n\r\nSimmer: Let the chai simmer for a few more minutes to allow the flavors to blend together.\r\n\r\nStrain and serve: Once the chai is ready, strain it into cups to remove the tea leaves and spices. Serve hot and enjoy!', 10, 3, 29, 2, '/chai.jpeg'),
(24, 'Paneer Butter Masala', 'Paneer butter masala is a classic North Indian dish featuring cubes of soft paneer (Indian cottage cheese) cooked in a creamy and flavorful tomato-based sauce. This rich and indulgent curry is infused with aromatic spices like cumin, coriander, and garam masala, and finished with a touch of butter and cream for a luxurious texture. It\'s a beloved vegetarian dish that pairs perfectly with naan, roti, or steamed rice, making it a favorite choice for both casual dinners and special ', 'Heat oil and butter in a pan over medium heat. Add chopped onions and sauté until they turn golden brown.\r\nAdd ginger-garlic paste and sauté for another minute until the raw smell disappears.\r\nStir in the tomato puree and cook until the oil starts to separate from the mixture, stirring occasionally.\r\nAdd cumin powder, coriander powder, turmeric powder, red chili powder, and salt. Mix well and cook for 2-3 minutes.\r\nAdd the paneer cubes and gently stir to coat them with the masala.\r\nPour in the heavy cream and mix until well combined. Let it simmer for 3-4 minutes until the sauce thickens slightly.\r\nSprinkle garam masala over the mixture and give it a final stir.\r\nGarnish with fresh coriander leaves and serve hot with naan, roti, or rice.', 30, 3, 30, 3, '/pbm.jpeg'),
(38, 'Butter Chicken', 'Butter Chicken, also known as Murgh Makhani, is a classic and beloved Indian dish renowned for its rich, creamy, and mildly spiced tomato-based sauce. Tender pieces of chicken are marinated in a yogurt and spice mixture, then cooked to perfection in a flavorful sauce made with butter, cream, tomatoes, and aromatic spices. The dish is characterized by its vibrant orange-red color and velvety texture, which is achieved by simmering the chicken in the creamy sauce until it is infused with all the flavors.', 'In a bowl, combine all the ingredients for the marinade. Add the chicken pieces and mix until well coated. Cover and refrigerate for at least 1 hour, or preferably overnight.\r\nHeat 1 tablespoon of butter and 1 tablespoon of oil in a large skillet or pan over medium heat. Add the marinated chicken pieces and cook until they are browned on all sides and cooked through. Remove the chicken from the pan and set aside.\r\nIn the same pan, add the remaining butter and oil. Add the chopped onion and sauté until it becomes soft and translucent.\r\nAdd the minced garlic, grated ginger, and green chilies (if using). Sauté for another 2-3 minutes until fragrant.\r\nStir in the tomato puree and cook for 5-7 minutes, stirring occasionally, until the mixture thickens and the raw flavor of the tomatoes is cooked off.\r\nAdd the red chili powder, garam masala, ground coriander, turmeric powder, and salt. Mix well and cook for another 2 minutes.\r\nPour in the heavy cream and honey (or sugar). Stir until everything is well combined and the sauce is creamy.\r\nAdd the cooked chicken pieces back to the pan. Stir to coat the chicken pieces with the sauce. Simmer for 5-10 minutes, allowing the flavors to meld together.\r\nTaste and adjust seasoning if needed. If the sauce is too thick, you can add a little water to reach your desired consistency.\r\nGarnish with fresh cilantro leaves and serve hot with rice, naan, or roti.', 45, 4, 31, 3, '/butterchicken.jpg'),
(39, 'Daal Makhani', 'Daal Makhani is a delicious Indian dish made with black lentils (urad dal) and kidney beans (rajma), cooked with spices, butter, and cream. ', '1 cup whole black lentils (urad dal)\r\n1/4 cup kidney beans (rajma)\r\n3 cups water for soaking\r\n3 cups water for pressure cooking\r\n2 tablespoons butter or ghee\r\n1 tablespoon oil\r\n1 large onion, finely chopped\r\n2 tomatoes, pureed\r\n1 tablespoon ginger-garlic paste\r\n2 green chilies, slit\r\n1 teaspoon cumin seeds\r\n1 teaspoon garam masala\r\n1 teaspoon red chili powder\r\n1/2 teaspoon turmeric powder\r\n1 teaspoon coriander powder\r\n1/2 cup cream\r\nSalt to taste\r\nChopped coriander leaves for garnish', 40, 3, 30, 3, '/daal.jpeg');

-- --------------------------------------------------------

--
-- Stand-in structure for view `recipeslist`
-- (See below for the actual view)
--
CREATE TABLE `recipeslist` (
`recipe_id` int(11)
,`recipe_name` varchar(100)
,`description` text
,`user_id` int(11)
,`recipe_by` varchar(50)
,`image_url` varchar(255)
,`recipe_category` varchar(50)
,`cook_time` int(11)
,`likes` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `recipe_category`
--

CREATE TABLE `recipe_category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `recipe_category`
--

INSERT INTO `recipe_category` (`category_id`, `category_name`) VALUES
(1, 'Soup'),
(2, 'Beverage'),
(3, 'Main Course'),
(4, 'Dessert'),
(5, 'Breakfast');

-- --------------------------------------------------------

--
-- Table structure for table `req_ingredients`
--

CREATE TABLE `req_ingredients` (
  `req_ingredient_id` int(11) NOT NULL,
  `recipe_id` int(11) DEFAULT NULL,
  `ingredient_id` int(11) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `measurement_unit` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `req_ingredients`
--

INSERT INTO `req_ingredients` (`req_ingredient_id`, `recipe_id`, `ingredient_id`, `quantity`, `measurement_unit`) VALUES
(28, 22, 1, 2.00, 'grams'),
(29, 22, 10, 4.00, 'grams'),
(30, 22, 18, 1.00, 'units'),
(31, 22, 21, 1.00, 'units'),
(32, 23, 64, 2.00, 'cup'),
(33, 23, 8, 3.00, 'units'),
(34, 23, 7, 5.00, 'grams'),
(35, 23, 12, 3.00, 'units'),
(36, 24, 19, 2.00, 'units'),
(37, 24, 21, 2.00, 'units'),
(38, 24, 101, 3.00, 'Teaspoon'),
(39, 24, 1, 2.00, 'Teaspoon'),
(40, 24, 64, 1.00, 'cup'),
(41, 24, 65, 2.00, 'Teaspoon'),
(42, 24, 78, 200.00, 'grams'),
(43, 24, 10, 3.00, 'Teaspoon'),
(44, 38, 82, 500.00, 'grams'),
(45, 38, 1, 2.00, 'Teaspoon'),
(46, 38, 6, 2.00, 'Teaspoon'),
(47, 38, 10, 2.00, 'Teaspoon'),
(48, 38, 21, 2.00, 'units'),
(49, 38, 19, 2.00, 'units'),
(50, 38, 98, 2.00, 'Teaspoon'),
(51, 38, 65, 3.00, 'Teaspoon'),
(52, 38, 71, 1.00, 'cup'),
(53, 39, 114, 1.00, 'cup'),
(54, 39, 111, 4.00, 'cup'),
(55, 39, 65, 2.00, 'Teaspoon'),
(56, 39, 19, 2.00, 'units'),
(57, 39, 1, 2.00, 'Teaspoon'),
(58, 39, 10, 2.00, 'Teaspoon'),
(59, 39, 101, 2.00, 'Teaspoon');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`) VALUES
(23, 'diksha', 'diksha@gmail.com', '2005'),
(24, 'urja', 'urja@gmail.com', '2004'),
(25, 'amey', 'ameypte@gmail.com', '2003'),
(26, 'bhavesh', 'bhavesh@gmail.com', '2002'),
(27, 'heramb', 'heramb@gmail.com', '2001'),
(28, 'tanaya', 'tanaya@gamil.com', 'tanaya'),
(29, 'Chetana', 'chetana@gmail.com', 'isha'),
(30, 'bhaveshxop', 'bhaveshxop@gmail.com', 'bhavesh123'),
(31, 'admin', 'admin@gmail.com', '123');

-- --------------------------------------------------------

--
-- Structure for view `recipeslist`
--
DROP TABLE IF EXISTS `recipeslist`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `recipeslist`  AS SELECT `r`.`recipe_id` AS `recipe_id`, `r`.`title` AS `recipe_name`, `r`.`description` AS `description`, `r`.`user_id` AS `user_id`, `u`.`username` AS `recipe_by`, `r`.`image_url` AS `image_url`, `rc`.`category_name` AS `recipe_category`, `r`.`cook_time` AS `cook_time`, count(`l`.`like_id`) AS `likes` FROM (((`recipes` `r` left join `users` `u` on(`r`.`user_id` = `u`.`user_id`)) left join `recipe_category` `rc` on(`r`.`recipe_category_id` = `rc`.`category_id`)) left join `likes` `l` on(`r`.`recipe_id` = `l`.`recipe_id`)) GROUP BY `r`.`recipe_id` ORDER BY count(`l`.`like_id`) DESC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `recipe_id` (`recipe_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`ingredient_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `ingredients_category`
--
ALTER TABLE `ingredients_category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`like_id`),
  ADD KEY `recipe_id` (`recipe_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`recipe_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `recipe_category_id` (`recipe_category_id`);

--
-- Indexes for table `recipe_category`
--
ALTER TABLE `recipe_category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `req_ingredients`
--
ALTER TABLE `req_ingredients`
  ADD PRIMARY KEY (`req_ingredient_id`),
  ADD KEY `recipe_id` (`recipe_id`),
  ADD KEY `ingredient_id` (`ingredient_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `ingredient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT for table `ingredients_category`
--
ALTER TABLE `ingredients_category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `like_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `recipe_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `recipe_category`
--
ALTER TABLE `recipe_category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `req_ingredients`
--
ALTER TABLE `req_ingredients`
  MODIFY `req_ingredient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD CONSTRAINT `ingredients_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `ingredients_category` (`category_id`) ON DELETE CASCADE;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipe_category_id` FOREIGN KEY (`recipe_category_id`) REFERENCES `recipe_category` (`category_id`),
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `req_ingredients`
--
ALTER TABLE `req_ingredients`
  ADD CONSTRAINT `req_ingredients_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `req_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
