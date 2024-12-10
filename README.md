# Map-Explore - MERN Stack Travel App

Map-Explore is a full-stack travel application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It allows users to pin their visited locations on a map, add reviews for those locations, and view reviews posted by other users for places they intend to visit. The application utilizes the Mapbox API for map integration and provides a seamless experience for travel enthusiasts.

## Features

- Pin visited locations on a map.
- Add reviews for visited locations.
- View reviews posted by other users for places of interest.
- User authentication and registration system.
- Responsive and user-friendly interface.

## Usage

- Sign up for a new account or log in with existing credentials.
- Pin your visited locations on the map.
- Add reviews for your visited locations.
- Explore reviews posted by other users for places you intend to visit.

## Libraries and Dependencies

### Frontend
- **React Map GL**: Integration of Mapbox maps within React components.
- **Axios**: For making HTTP requests to the backend API.
- **Material-UI Icons**: Provides a variety of icons for UI elements.
- **Timeago.js**: Formats timestamps into human-readable time ago format.

### Backend
- **bcrypt**: Hashing and salting passwords for secure storage.
- **Nodemon**: Automatic restarting of the Node.js application during development.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.

## Installation and Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/VimukthiMK/Map-Explore.git
    ```

2. Navigate to the project directory:

3. Install frontend and backend dependencies:

    ```bash
    # Install frontend dependencies
    cd frontend-app
    npm i 

    # Install backend dependencies
    cd ../backend-app
    npm i
    ```

4. Set up environment variables:

    - Create a `.env` file in the frontend and backend directory.
    - Define the following environment variables:
        - Frontend
        - `REACT_APP_MAPBOX`: Mapbox access token for map integration.
      - `REACT_APP_SERVER_URL`: Backend Server url.
      - Backend
      - `MONGO_URL`: MongoDB connection URI.
        - `PORT`: Port for Backend Server.
       - `CLIENT_URL`: Frontend Server Url.

5. Start the backend server:

    ```bash
    # Navigate to the backend directory
    cd backend-app

    # Start the server
    npm start
    ```

6. Start the frontend application:

    ```bash
    # Navigate to the frontend directory
    cd ../frontend-app

    # Start the application
    npm start
    ```

    Open your browser and visit [http://localhost:3000](http://localhost:3000) to view the application.


