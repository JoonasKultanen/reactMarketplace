# React Marketplace

React Marketplace is an online marketplace application that allows users to list, browse, and sell items. It features a secure login and registration system, item listing with detailed information, browsing capabilities with filters and search, and user profiles for managing listings and personal information.

## Deployment

The application is currently deployed at [https://reactmarketplace.onrender.com/](https://reactmarketplace.onrender.com/).

## Features

- **User Authentication**: Secure login and registration system for users.
- **Item Listing**: Users can list items they want to sell with details like title, description, price, and category.
- **Browse Items**: Users can browse listed items and filter them based on categories and price, also search by keywords.
- **User Profiles**: Users can view and edit their profiles, and view their own listings.

## Installation

### Prerequisites

- Node.js
- npm (Install the latest version with `npm install npm@latest -g`)
- Docker (for containerization)

### Installation and Running Locally

1. Clone the repo: git clone https://github.com/JoonasKultanen/reactMarketplace.git

2. Navigate to the backend directory: cd reactMarketplace cd backend

3. Install NPM packages: npm install

4. Start the application: npm start

5. For the frontend, navigate to the frontend directory and install dependencies: cd .. && cd frontend && npm install && npm run dev

## Usage

After installation, the application will be running on your local server. You can access the backend by navigating to `http://localhost:5000` in your web browser.

**Note**: You might be missing environment variables. Ensure you have all necessary environment variables set up for the application to run correctly.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
