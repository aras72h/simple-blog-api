## Setup Your Database
Make sure you have PostgreSQL installed and running. Then, create a database and tables:

### Create database and tables
```sql
CREATE DATABASE blog;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_like_blog (
  user_id INTEGER REFERENCES users(id),
  blog_id INTEGER REFERENCES blogs(id),
  PRIMARY KEY (user_id, blog_id)
);
```

### Configure database configuration file
Modify `db.js` file in `config` directory

## Start Application

### Install dependencies
```sh
npm install
```

### Run server
```sh
npm start
```

## Test it with Postman

By following these steps, you should be able to use Postman to register a user, log in to get a JWT token, and then use that token to post a blog and like a blog post.

To post a blog or like a blog using Postman, you'll need to follow these steps. Here’s a step-by-step guide:

### Step 1: Register a User

1. **Open Postman.**
2. **Create a new POST request** to `http://localhost:3000/auth/register`.
3. **In the Body tab**, select `raw` and choose `JSON` format.
4. **Enter the JSON data** for the new user. For example:
    ```json
    {
      "username": "testuser",
      "password": "password123"
    }
    ```
5. **Send the request**. You should get a response with the user details.

### Step 2: Log in to Get the JWT Token

1. **Create a new POST request** to `http://localhost:3000/auth/login`.
2. **In the Body tab**, select `raw` and choose `JSON` format.
3. **Enter the JSON data** for the login credentials. For example:
    ```json
    {
      "username": "testuser",
      "password": "password123"
    }
    ```
4. **Send the request**. You should get a response with a JWT token. Copy this token.

### Step 3: Post a Blog

1. **Create a new POST request** to `http://localhost:3000/blog`.
2. **In the Headers tab**, add a new header:
    - Key: `Authorization`
    - Value: `Bearer <your_jwt_token>`
    - Replace `<your_jwt_token>` with the token you copied from the login response.
3. **In the Body tab**, select `raw` and choose `JSON` format.
4. **Enter the JSON data** for the blog post. For example:
    ```json
    {
      "title": "My First Blog Post",
      "content": "This is the content of my first blog post."
    }
    ```
5. **Send the request**. You should get a response with the details of the created blog post.

### Step 4: Like a Blog Post

1. **Create a new POST request** to `http://localhost:3000/blog/<blog_id>/like`.
    - Replace `<blog_id>` with the ID of the blog post you want to like.
2. **In the Headers tab**, add a new header:
    - Key: `Authorization`
    - Value: `Bearer <your_jwt_token>`
    - Replace `<your_jwt_token>` with the token you copied from the login response.
3. **Send the request**. You should get a response indicating that the blog post was liked.

### Step 5: List all blog posts

1. **Create a new GET request** to `http://localhost:3000/blog`.

### Example of Request Headers in Postman

When you add the `Authorization` header in Postman, it should look something like this:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Summary of Requests

1. **Register User:**
    - **URL**: `http://localhost:3000/auth/register`
    - **Method**: POST
    - **Body**:
        ```json
        {
          "username": "testuser",
          "password": "password123"
        }
        ```

2. **Login User:**
    - **URL**: `http://localhost:3000/auth/login`
    - **Method**: POST
    - **Body**:
        ```json
        {
          "username": "testuser",
          "password": "password123"
        }
        ```

3. **Post Blog:**
    - **URL**: `http://localhost:3000/blog`
    - **Method**: POST
    - **Headers**:
        - Key: `Authorization`
        - Value: `Bearer <your_jwt_token>`
    - **Body**:
        ```json
        {
          "title": "My First Blog Post",
          "content": "This is the content of my first blog post."
        }
        ```

4. **Like Blog Post:**
    - **URL**: `http://localhost:3000/blog/<blog_id>/like`
    - **Method**: POST
    - **Headers**:
        - Key: `Authorization`
        - Value: `Bearer <your_jwt_token>`
		
5. **List All Blog Posts:**
    - **URL**: `http://localhost:3000/blog`
    - **Method**: GET



## File Structure

```sh
project-root|
            ├── config/
            │   └── db.js
            ├── controllers/
            │   └── authController.js
            │   └── blogController.js
            ├── models/
            │   └── user.js
            │   └── blog.js
            ├── routes/
            │   └── authRoutes.js
            │   └── blogRoutes.js
            ├── middlewares/
            │   └── authMiddleware.js
            ├── views/
            │   └── index.ejs
            ├── public/
            │   ├── css/
            │   └── js/
            ├── app.js
            └── package.json
```

### 1. `config/`
- **Purpose**: Contains configuration files for your application.
- **Example File**: `db.js`
  - This file sets up and exports the database connection so that other parts of your application can use it to interact with the database.

### 2. `controllers/`
- **Purpose**: Contains the logic for handling requests and responses. This is where the main actions of your application occur.
- **Example Files**:
  - `authController.js`: Handles user registration and login actions.
  - `blogController.js`: Handles actions related to creating blog posts, liking posts, and listing posts.

### 3. `models/`
- **Purpose**: Represents the data structure of your application and interacts with the database. Each model corresponds to a table in the database.
- **Example Files**:
  - `user.js`: Defines the User model, including methods for creating users and finding users by username.
  - `blog.js`: Defines the Blog model, including methods for creating blog posts, liking posts, and listing posts.

### 4. `routes/`
- **Purpose**: Defines the endpoints (routes) of your application and maps them to the appropriate controller actions.
- **Example Files**:
  - `authRoutes.js`: Defines routes related to user authentication, such as registration and login.
  - `blogRoutes.js`: Defines routes related to blog posts, such as creating, liking, and listing posts.

### 5. `middlewares/`
- **Purpose**: Contains middleware functions that perform tasks before the main request handler is executed. These can be used for things like authentication and logging.
- **Example File**:
  - `authMiddleware.js`: Contains a function to verify the JWT token, ensuring that users are authenticated before accessing certain routes.

### 6. `views/`
- **Purpose**: Contains templates for rendering the HTML views of your application. This is more relevant for server-side rendering.
- **Example File**:
  - `index.ejs`: A template file for the main page of your application (if you were rendering HTML views).

### 7. `public/`
- **Purpose**: Contains static files like CSS and JavaScript that are served directly to the client.
- **Example Subfolders**:
  - `css/`: Directory for CSS files.
  - `js/`: Directory for JavaScript files.

### 8. Root Files
- **`app.js`**: The main entry point of your application. It sets up the Express app, configures middleware, and starts the server.
- **`package.json`**: Contains metadata about your project, such as dependencies, scripts, and project information.

### How They Work Together:
1. **`app.js`**: Sets up the Express application and uses routes defined in `routes/` to handle incoming requests.
2. **`routes/`**: Maps incoming requests to the appropriate controller functions.
3. **`controllers/`**: Contains the logic for handling requests, performing necessary actions using the models, and sending responses back to the client.
4. **`models/`**: Interacts with the database to fetch, insert, update, or delete data as requested by the controllers.
5. **`middlewares/`**: Adds additional processing steps for requests, such as verifying that a user is authenticated.
6. **`config/`**: Provides configuration details like database connection settings.
7. **`views/`** and **`public/`**: Serve the front-end assets and templates for rendering HTML views (if applicable).

This structure helps keep your code organized and makes it easier to maintain and scale your application as it grows.