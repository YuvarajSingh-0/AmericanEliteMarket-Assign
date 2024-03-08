# AmericanEliteMarket Assignment

## API Endpoints

### Auth Routes

#### `POST /register`

- Signs up the user with the passed username and password and returns a jwt token along with the userId

#### `POST /login`

- Logs in the user if the username and password matches and returns a jwt token along with the userId

### User Routes

#### `GET /users/{id}`

- Fetches the user with the given ID. Returns a JSON object with the user's information 

#### `PUT /users`

- Updates the user with the given ID 
- This route requires authentication 
- The request body should include the fields to be updated (`username`, `bio`, `image`) 
- Returns a JSON object with the updated user's information

#### `DELETE /users`

- Deletes the user with the given ID 
- This route requires authentication 
- Returns a success message if the deletion was successful

#### `POST /users/follow`

- Creates a follow relationship between the authenticated user and the user with the given ID 
- This route requires authentication 
- Returns a success message if the follow was successful

#### `DELETE /users/unfollow`

- Deletes a follow relationship between the authenticated user and the user with the given ID 
- This route requires authentication
- Returns a success message if the unfollow was successful

#### `GET /users/{id}/followers`

- Fetches the followers of the user with the given ID 
- Returns a JSON array of the user's followers

#### `GET /users/{id}/following`

- Fetches the users that the user with the given ID is following 
- Returns a JSON array of the users that the user is following

#### `GET /users/following/posts`
- Fetches the latest posts from users that the authenticated user follows 
- This route requires authentication 
- Thir route makes use of `aggregate()` function in MongoDB to get the posts that belongs to his followers sorted by creation date
- Returns a JSON array of the posts

#### `GET /users/{id}/posts`
- Fetches the posts by the user with the given ID 
- The number of posts returned can be controlled with the `page` and `limit` query parameters 
- Returns a JSON object with the posts and a flag indicating whether there are more posts

### Posts Routes

#### `GET /posts`

- Fetches all posts, sorted by creation date in descending order
- The number of posts returned can be controlled with the `page` and `limit` query parameters
- Each post is returned with the author's details filled 
- The number of posts returned is limited to 5

#### `GET /posts/{id}`

- Fetches the post with the given ID
- Returns the post details with the author's details filled, post creation date and content

#### `POST /posts/new`

- Creates a new post 
- This route requires authentication 
- The request body should include the `content` of the post

#### `DELETE /posts/{id}`

- Deletes the post with the given ID
- This route requires authentication 
- Only the author of the post can delete it


## TakeAways

### The Advantage of FollowSchema

- **Scalability**: As the number of followers and following grows, the UserSchema can become inefficient because it stores all the following users in an array within the user document. There is a size limitation on a document in a collection i.e., 16 megabytes which is avoided by the FollowSchema. On the other hand, the FollowSchema can handle large numbers of followers and following more efficiently.

- **Query Efficiency**: It’s easier and more efficient to query the FollowSchema for specific follow relationships. For example, to find all the users that a specific user is following or to find all the followers of a specific user.

- **Data Integrity**: The FollowSchema provides better data integrity. If a user is deleted, their follow relationships are also deleted. In the UserSchema, if a user is deleted, their ID may still exist in the following arrays of other users.

### The Reason behind using startSession() in [this code block](https://github.com/YuvarajSingh-0/AmericanEliteMarket-Assign/blob/9afb57da22b03f1d2e4bf2ff08fdf23362b31a53/src/routes/users.js#L30-L59)

###### The Popular ACID properties

- **Atomicity**: The session ensures that all operations (deleting posts, login credentials, and user profile) are treated as a single unit of work. If any operation fails, the entire transaction is rolled back, leaving the database in a consistent state.
- **Consistency**: By using a session, you ensure that the database transitions from one consistent state to another. If an error occurs during the transaction, the database reverts back to its original state.
- **Isolation**: Sessions provide isolation, meaning that uncommitted changes are not visible to other sessions until they are committed.
- **Durability**: Once the changes are committed, they are permanent and survive subsequent system failures.

**Neccessity in [this](https://github.com/YuvarajSingh-0/AmericanEliteMarket-Assign/blob/9afb57da22b03f1d2e4bf2ff08fdf23362b31a53/src/routes/users.js#L30-L59) codeblock**: In the [implemeted code](https://github.com/YuvarajSingh-0/AmericanEliteMarket-Assign/blob/9afb57da22b03f1d2e4bf2ff08fdf23362b31a53/src/routes/users.js#L30-L59), if an error occurs while deleting the user’s posts, login credentials, or profile, the session aborts the transaction and the database remains unchanged. This prevents partial deletions and ensures data integrity. If all operations are successful, the session commits the transaction and all changes are saved to the database.

## Project Structure and File Meaning

This project is organized as follows:

- `src/`: This directory contains all the core functionality of the application.
    - `assets/`: This directory contains the DataBase Design Schema Diagram as .png and .svg files
    - `config/`: This directory contains the configuration files.
        - `db.js`: Defines the connection for MongoDB database.
    - `middlewares/`: This directory contains middleware functions for the application.
        - `auth.js`: Provides authentication middleware using JWT.
    - `models/`: This directory contains the Mongoose models for the application.
        - `User.js`: Defines the User model.
        - `Login.js`: Defines the Login model.
        - `Post.js`: Defines the Post model.
        - `Follow.js`: Defines the Follow model.
    - `routes/`: This directory contains the route handlers for the application.
        - `users.js`: Defines the routes for user-related operations. Prefix is `/users`
        - `posts.js`: Defines the routes for post-related operations. Prefix is `/posts`
        - `auth.js`: Defines the routes for Authorization operations like login and register.
    - `index.js`: This is the main application file. It sets up the Express application, connects to the MongoDB database, and starts the server.
- `package.json`: This file lists the project dependencies and other metadata.
- `README.md`: This file provides an overview of the project and instructions for running the application.
- `.gitignore`: Ignores the files not needed for github tracking
- `.env.example`: Example file for `.env` to create yourself with your secret values.

## Schema Design

![](https://github.com/YuvarajSingh-0/AmericanEliteMarket-Assign/blob/master/src/assets/ER-model.svg)

## Setup Instructions

Follow these steps to set up the project:

### 1. Install Node.js and npm

If you haven't already, you'll need to install Node.js and npm (which comes with Node.js). You can download them from the official Node.js website.

### 2. Clone the Project

Clone the project repository
```bash
git clone https://github.com/YuvarajSingh-0/AmericanEliteMarket-Assign.git
```

### 3. Install Dependencies

Navigate to the project directory in your terminal and run the following command to install all the project dependencies listed in the `package.json` file:

```bash
npm install
```
### 4. Set Up Your Database
This project uses MongoDB with Mongoose. If you don’t have MongoDBs server, Mongosh installed, you’ll need to install it and set up a database for your project. You’ll also need to update database connection strings in .env file in the upcoming step.

Note: Normally, MongoDB server is enough for working with database, which creates standalone server in the local machine. But, for [this particular codeblock](https://github.com/YuvarajSingh-0/AmericanEliteMarket-Assign/blob/9afb57da22b03f1d2e4bf2ff08fdf23362b31a53/src/routes/users.js#L30-L59) to work Mongo shell is needed which is used to setup a replica set. Transactions only work with the replica set being setup. So, follow the below steps:

- Download and install [MongoDB community server](https://www.mongodb.com/try/download/community) and [Mongo shell](https://www.mongodb.com/try/download/shell)
- If the mongoDB is already running, stop the service by entering the below command in command prompt after opening it administrator mode
```bash
net stop MongoDB
```
- Now change the directory to bin Folder of wherever the MongoDB is installed usually it is in `C:\Program Files\MongoDB\Server\7.0\bin`
```bash
cd C:/"program files"/MongoDB/Server/7.0/bin
```
- Now register the replica set in the databse service
```bash
mongod --replSet "rs0"
```
- Now we need the initiate the replica set to be running for that open the mongoshell and type in 
```bash
rs.initiate()
```
Now everything is set.

**If you wish not to go through this setup hassle. comment out [this codeblock](https://github.com/YuvarajSingh-0/AmericanEliteMarket-Assign/blob/e700c94734832b66108ddffbdf65cf88cb1f4096/src/routes/users.js#L34-L64) and uncomment [this codeblock](https://github.com/YuvarajSingh-0/AmericanEliteMarket-Assign/blob/e3c2f9efc2ce2f21ff79e103937af6ce3ff6a195/src/routes/users.js#L65-L77)**


### 5. Environment Variables
You’ll need to create your own .env file in the root of your project and add the necessary variables mentioned.
- `JWT_SECRET`
- `MONGODB_URI` - `mongodb://hostnameWithUsernameAndPassoword/databasename`
    replace this string with appropriate URL

### 6. Start the Server
Once everything is set up, you can start the server by running the following command in your terminal:
```bash
npm start
```

This will open a [http://localhost:3000](http:localhost:3000) site.
