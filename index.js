//______Welcome to the Secrets API. This API allows you to manage and retrieve secrets anonymously.
import express, { response } from "express";
import axios from "axios";
import bodyParser from "body-parser";
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3001;

// Setted { extended: true } It allows the bodyParser to accept json like data within the form data including nested objects. e.g. { person: { name: Adam } }
app.use(bodyParser.urlencoded({ extended: true }));


//___api url to use in all axios requests.
const API_URL = "https://secrets-api.appbrewery.com";


//TODO 1: Values for the 3 types of auth.
//_______________________________________________________.
var userName = null;
var passwordUser = null;
var registerKey= null;
var registerRes = null;
var bearerKey = null;
//____________________________________________________.

var content = "Here's the Output from the buttons on green side of the page";

// This get method initialize the page with all parameters null;
app.get("/", (req, res) => {
  res.render("index.ejs", { content: content, registerRes, registerKey, bearerKey});
});

//____________________________________________________.
 
app.post("/registerUser", async (req, res) => {
   // Registers a new user. If the username is already taken, it will return an error.
  try {

    // req.body.inputUserName is the data coming from the form body on index.ejs file.
    userName = req.body.inputUserName;
    passwordUser = req.body.inputPasswordUser;

    //console.log To make sure the Data was received from Form.
    console.log(userName, passwordUser);

//The data come from the form on index.ejs and are formatted to JSON and stored to a variable to use in the Axios post method.
    const params = JSON.stringify({
      username: userName,
      password: passwordUser,
    });

    console.log(params);

    // The params variable is sent to API with Axios post request to register a user;
    await axios
      .post(API_URL + "/register", params, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((response) => {
        const registerRes = response.data.success;

        res.render("index.ejs", { content: content, registerRes, registerKey, bearerKey });
      });
  } catch (error) {
    res.render("errorHandler.ejs", { errorMessage: error });
  }
});
//____________________________________________________

app.get("/bearerToken", async (req, res) => {
  // Generates an authentication token for a user. If the user does not exist or the password is incorrect, it will return an error.
 
  try {

    const params = JSON.stringify({
      username: userName,
      password: passwordUser,
    });

    const response = await axios.post(API_URL + "/get-auth-token", params, {
      headers: {
        "content-type": "application/json",
      },
    })

    bearerKey = response.data.token;
    res.render("index.ejs", { content,  registerRes, registerKey, bearerKey });

  } catch (err) {
    res.render("errorHandler.ejs", {errorMessage: err.message})
    // console.error("Failed to make request:" + err.message);
  }
  // This block of code generate a BearerToken**
});

//____________________________________________________

app.get("/apigenerator", async (req, res) => {
  // Generates a new API key.

  try {
    const result = await axios.get(API_URL + "/generate-api-key");

    registerKey = result.data.apiKey

    res.render("index.ejs", {content, registerRes, registerKey, bearerKey})
  } catch (err) {
    console.error("Failed to make request:" + err.message);
  }
});

//____________________________________________________

app.get("/noAuth", async (req, res) => {
// Returns a random secret. No authentication is required.

  try {
    const result = await axios.get(API_URL + "/random");
    res.render("index.ejs", {content: JSON.stringify(result.data), registerRes, registerKey, bearerKey
    });
  } catch (error) {
    res.status(404).send(error.message);
  }

  //I used axios to hit up the /random endpoint.
  //I got the data back and sent to the ejs file as "content".
  //I use JSON.stringify to turn the JS object from axios into a string.
});

//______________________________________________________

app.get("/basicAuth", async (req, res) => {
  // Returns all secrets, paginated. Basic authentication is required.

  try {
    const result = await axios.get(

      //Specified only secrets from page 2
      API_URL + "/all?page=2",
      {
        auth: {
          username: userName,
          password: passwordUser,
        },
      }
    );

    //console.log just to be sure about the api response.
    console.log("data received");
    res.render("index.ejs", { content: JSON.stringify(result.data), registerRes, registerKey, bearerKey });

  } catch (error) {
    res.render("errorHandler.ejs", { errorMessage: error });
    // res.status(404).send(error.message);
  }
  //Code to hit up the /all endpoint.
});

//______________________________________________________.

app.post("/apiKey", async (req, res) => {
  // Returns a random secret with a particular embarrassment score or higher.  API key authentication is required.

  try {
    const score = req.body.embaressScore;
    console.log(score);

    const response = await axios.get(
      API_URL +
        `/filter?score=${score}&apiKey=${registerKey}`
    );

    //console.log just to be sure about the api response.
    console.log("data received");

    //I used Math.floor/random to generate a random number based on api data length to display a random secret. 
    const randomNumberBasedOnData = response.data.length;
    const randomSecret = Math.floor(Math.random() * randomNumberBasedOnData);

    res.render("index.ejs", {
      content: JSON.stringify(response.data[randomSecret].secret), registerRes, registerKey, bearerKey});

  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("errorHandler.ejs", { errorMessage: error.message});
  }

  //This block code here hit up the /filter endpoint.
  //Filter for all secrets with an embarassment score selected from the "<select name="embaressScore> options on index.ejs."
});

//____________________________________________________

//Returns the secret with the specified ID. Bearer token authentication is required.
app.get("/secretsById", async(req, res) => {
  try {

    const response = await axios.get(API_URL + "/secrets/42", {
      // headers based on bearer model request.
      headers: {
        Authorization: `Bearer ${bearerKey}`
      }
    })

    res.render("index.ejs", { content: JSON.stringify(response.data), registerRes, registerKey, bearerKey} )
  } catch (error) {

    console.error("Failed to make request:", error.message);
    res.render("errorHandler.ejs", { errorMessage: error});
  }
})

//__________________________________________________________
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Thanks for Read This :)