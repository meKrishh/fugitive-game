Project Overview
The Fugitive Capture Application is a web application where three cops must capture a fugitive hiding in one of five cities. Each cop selects a city and an electric vehicle based on distance constraints and the system determines if they successfully capture the fugitive.

Setup Guide

Step 1: To set up the Fugitive Game locally, start by cloning the repository using the command git clone https://github.com/meKrishh/fugitive-game.git and navigate into the project directory with cd fugitive-game.

Step 2: Once inside, configure the environment variables by creating a .env.local file in the root directory and adding your MySQL credentials: DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME. Make sure to replace the placeholders with your actual database details.

Step 3: After that, install the project dependencies by running npm install.

Step 4: Once the dependencies are installed, follow the game workflow: first, go to /select-city and choose unique cities for the 3 cops, then move to /select-vehicle to select valid vehicles for each cop, considering the distance constraints. Finally, check the results by visiting /result to see if any cop has successfully captured the fugitive.

Step 5: To run the application locally execute npm run dev and the app will be available at http://localhost:3000.
The app will be available at http://localhost:3000
