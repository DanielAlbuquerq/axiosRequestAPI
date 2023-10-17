# axiosRequestAPI


#### Secrets API Project: <a href="http://example.com/" target="_blank"> https://secretsaxiosapi-b3e9cd976acb.herokuapp.com/</a>
#### Welcome to the Secrets API.

Using the Express/Node.js, with the Axios HTTP client, that integrates a public API
This API allows you to manage and retrieve secrets and more details. Please read the documentation below for details on how to interact.

The API is rate limited to 100 requests every 15 minutes.<br>
All user submitted data (including registration, tokens, usernames, passwords, and secrets) are erased on a regular basis.<br>  
______________________________________________________________________________________________________________________
#### Buttons Functionality.

##### <kbd> <br> BASIC AUTH  <br> </kbd> 
Returns all secrets on page 2, but you need to create a username and password to authenticate.

#### <kbd> <br>NO AUTH <br> </kbd> 
Returns a random secret. No authentication is required.

#### <kbd> <br>RANDOM SECRET<br> </kbd> 
Returns a random secret with a particular embarrassment score or higher but you need to generate an APIkey.

#### <kbd> <br>SecretsByID<br> </kbd>
Returns the secret with the specified ID. Bearer token authentication is required.

_______________________________________________________________________________________________________________________


