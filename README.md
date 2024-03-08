# API Endpoints

## User Routes

### `GET /users/:id`

Fetches the user with the given ID. Returns a JSON object with the user's information.

### `PUT /users`

Updates the user with the given ID. This route requires authentication. The request body should include the fields to be updated (`username`, `bio`, `image`). Returns a JSON object with the updated user's information.

### `DELETE /users`

Deletes the user with the given ID. This route requires authentication. Returns a success message if the deletion was successful.

### `POST /users/follow/:id`

Creates a follow relationship between the authenticated user and the user with the given ID. This route requires authentication. Returns a success message if the follow was successful.

### `DELETE users/unfollow/:id`

Deletes a follow relationship between the authenticated user and the user with the given ID. This route requires authentication. Returns a success message if the unfollow was successful.

### `GET users/:id/followers`

Fetches the followers of the user with the given ID. Returns a JSON array of the user's followers.

### `GET users/:id/following`

Fetches the users that the user with the given ID is following. Returns a JSON array of the users that the user is following.

### `GET /users/following/posts`
Fetches the latest posts from users that the authenticated user follows. This route requires authentication. Returns a JSON array of the posts.

### `GET /users/:id/posts`
Fetches the posts by the user with the given ID. The number of posts returned can be controlled with the page and limit query parameters. Returns a JSON object with the posts and a flag indicating whether there are more posts.

### `POST users/follow/:id`
Creates a follow relationship between the authenticated user and the user with the given ID. This route requires authentication. Returns a success message if the follow was successful.

## Posts Routes

All post routes have a prefix of `/posts`.

### `GET /posts`

Fetches all posts, sorted by creation date in descending order. Each post is returned with the author's details populated. The number of posts returned is limited to 5.

### `GET /posts/:id`

Fetches the post with the given ID.

### `POST /posts/new`

Creates a new post. This route requires authentication. The request body should include the `content` of the post.

### `DELETE /posts/:id`

Deletes the post with the given ID. This route requires authentication. Only the author of the post can delete it.


# TakeAways

## The Advantage of FollowSchema

- **Scalability**: As the number of followers and following grows, the UserSchema can become inefficient because it stores all the following users in an array within the user document. There is a size limitation on a document in a collection i.e., 16 megabytes which is avoided by the FollowSchema. On the other hand, the FollowSchema can handle large numbers of followers and following more efficiently.

- **Query Efficiency**: It’s easier and more efficient to query the FollowSchema for specific follow relationships. For example, to find all the users that a specific user is following or to find all the followers of a specific user.

- **Data Integrity**: The FollowSchema provides better data integrity. If a user is deleted, their follow relationships are also deleted. In the UserSchema, if a user is deleted, their ID may still exist in the following arrays of other users.

## The Reason behind using startSession() in this code block

##### The Popular ACID properties

- **Atomicity**: The session ensures that all operations (deleting posts, login credentials, and user profile) are treated as a single unit of work. If any operation fails, the entire transaction is rolled back, leaving the database in a consistent state.
- **Consistency**: By using a session, you ensure that the database transitions from one consistent state to another. If an error occurs during the transaction, the database reverts back to its original state.
- **Isolation**: Sessions provide isolation, meaning that uncommitted changes are not visible to other sessions until they are committed.
- **Durability**: Once the changes are committed, they are permanent and survive subsequent system failures.

**Neccessity in [this]() codeblock**: In the [implemeted code](), if an error occurs while deleting the user’s posts, login credentials, or profile, the session aborts the transaction and the database remains unchanged. This prevents partial deletions and ensures data integrity. If all operations are successful, the session commits the transaction and all changes are saved to the database.

# Setup Instructions
