Project Overview
The Fugitive Capture Application is a web application where three cops must capture a fugitive hiding in one of five cities. Each cop selects a city and an electric vehicle based on distance constraints and the system determines if they successfully capture the fugitive.

Setup Guide
1. Clone the Repository
git clone https://github.com/meKrishh/fugitive-game.git
cd fugitive-game

2. Configure Environment Variables
Create a .env.local file and add:
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=your-database-name

3. Install Dependencies
npm i

WorkFlow
1️. Go to /select-city and choose unique cities for 3 cops.
2️. Go to /select-vehicle and pick valid vehicles for each cop based on distance constraints.
3️. Go to /result to check if any cop captured the fugitive.


5. Start the App Locally
npm run dev
The app will be available at http://localhost:3000
