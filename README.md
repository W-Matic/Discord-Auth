<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>

  <h1>Discord Authentication and Guild Membership Script</h1>

  <p>This script provides a simple authentication flow using Discord OAuth2 and grants access to a specified guild by assigning a role to the authenticated user.</p>

  <h2>How it Works</h2>

  <ol>
    <li><strong>Setting up Environment Variables:</strong> The script uses <code>dotenv</code> to load environment variables from a <code>.env</code> file. Ensure to provide values for <code>PORT</code>, <code>MONGODB_URI</code>, <code>Guild_ID</code>, <code>Role_ID</code>, <code>BOT_TOKEN</code>, <code>ClientID</code>, and <code>ClientSecret</code>.</li>
    <li><strong>Initializing Express Server:</strong> The script creates an Express.js server instance and listens on the specified port.</li>
    <li><strong>Connecting to MongoDB:</strong> It establishes a connection to MongoDB using Mongoose. If the connection is successful, it logs the success message.</li>
    <li><strong>Defining MongoDB Schemas:</strong> Two MongoDB schemas are defined: <code>userCreatorSchema</code> and <code>discordCredentialsSchema</code>. These schemas structure the data to be stored in the database.</li>
    <li><strong>Adding Member to Guild:</strong> The <code>addMemberToGuild</code> function is responsible for adding a member to the Discord guild and assigning a specified role to them. It utilizes Axios to make requests to the Discord API.</li>
    <li><strong>Handling OAuth2 Redirect:</strong> When a user is redirected back to the server after authenticating via Discord OAuth2, the <code>/api/auth/discord/redirect</code> endpoint is triggered. The script retrieves the authorization code from the query parameters and exchanges it for an access token and refresh token.</li>
    <li><strong>Saving User Data:</strong> The user's Discord ID, avatar ID, email, and refresh token are saved to MongoDB.</li>
    <li><strong>Assigning Guild Role:</strong> The script then calls <code>addMemberToGuild</code> to add the user to the specified guild and assign the designated role.</li>
    <li><strong>Handling Errors:</strong> Any errors that occur during the authentication process are logged, and appropriate error responses are sent.</li>
  </ol>

  <h2>Running the Script</h2>

  <ol>
    <li>Clone the repository.</li>
    <li>Create a <code>.env</code> file and fill in the required environment variables.</li>
    <li>Install dependencies using <code>npm install</code>.</li>
    <li>Start the server with <code>node app.js</code>.</li>
    <li>Access the authentication flow by navigating to <code>http://localhost:1500/api/auth/discord/redirect</code>.</li>
  </ol>

  <p>Ensure that the Discord OAuth2 credentials, MongoDB URI, and other environment variables are correctly configured for the script to work as expected.</p>

</body>

</html>
