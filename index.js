import express, { response } from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3001;

// Setted { extended: true } It allows the bodyParser to accept json like data within the form data including nested objects. e.g. { person: { name: Adam } }
app.use(bodyParser.urlencoded({ extended: true }));

const API_URL = "https://secrets-api.appbrewery.com";

//TODO 1: Fill in your values for the 3 types of auth.
// const yourUsername = "";
// const yourPassword = "";

var yourAPIKey = "";
const yourBearerToken = "";
//___________________________________________________
var userName = null;
var passwordUser = null;
var registerKey= null;
var registerRes = null;
var bearerKey = null;
var content = "Empty";
//____________________________________________________

app.get("/", (req, res) => {
  res.render("index.ejs", { content: content, registerRes, registerKey, bearerKey});
});

//____________________________________________________

app.post("/registerUser", async (req, res) => {
  try {
    userName = req.body.inputUserName;
    passwordUser = req.body.inputPasswordUser;

    //console.log To make sure the Data was received from Form
    console.log(userName, passwordUser);

    const params = JSON.stringify({
      username: userName,
      password: passwordUser,
    });

    console.log(params);
    // Registers a new user. If the username is already taken, it will return an error.
    await axios
      .post(API_URL + "/register", params, {
        headers: {
          "content-type": "application/json",
        },
      })
      .then((response) => {
        const responseAPI = response.data.success;
        registerRes = responseAPI;

        res.render("index.ejs", { content: content, registerRes, registerKey, bearerKey });
      });
  } catch (error) {
    res.render("errorHandler.ejs", { errorMessage: error });
  }
});
//____________________________________________________

app.get("/bearerToken", (req, res) => {
  // Generates an authentication token for a user. If the user does not exist or the password is incorrect, it will return an error.
  try {

    const params = JSON.stringify({
      username: userName,
      password: passwordUser,
    });

    const response = axios.post(API_URL + "/get-auth-token", params, {
      headers: {
        "content-type": "application/json",
      },
    })
    .then(() => {
      bearerKey = JSON.stringify(response.data.token);
      console.log("Here's the" + yourBearerToken);

      res.render("index.ejs", { content,  registerRes, registerKey, bearerKey });
    });

  } catch (err) {
    res.render("errorHandler.ejs", {errorMessage: err.message})
    // console.error("Failed to make request:" + err.message);
  }
  // This block of code generate a BearerToken**
});

//____________________________________________________

app.get("/apigenerator", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/generate-api-key");
    registerKey = JSON.stringify(result.data.apiKey);

    res.render("index.ejs", {content:content , registerRes, registerKey, bearerKey})
  } catch (err) {
    console.error("Failed to make request:" + err.message);
  }
});

//____________________________________________________
app.get("/noAuth", async (req, res) => {
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

//____________________________________________________
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
  //Code to hit up the /all endpoint
});

//____________________________________________________
app.post("/apiKey", async (req, res) => {
  try {
    const score = req.body.embaressScore;
    console.log(score);

    const response = await axios.get(
      API_URL +
        `/filter?score=${score}&apiKey=f8943c7c-fb99-4bea-856c-8964a550a5e2`
    );

    // console.log(apiResult)
    // yourAPIKey = apiResult

    //console.log just to be sure about the api response.
    console.log("data received");

    const randomNumberBasedOnData = response.data.length;
    const randomSecret = Math.floor(Math.random() * randomNumberBasedOnData);

    res.render("index.ejs", {
      content: JSON.stringify(response.data[randomSecret].secret), registerRes, registerKey, bearerKey
    });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", { error: error.message });
  }
  //This block code here hit up the /filter endpoint
  //Filter for all secrets with an embarassment score selected
});
//____________________________________________________

// const config = {
//   headers: {Authorization: `Bearer ${yourBearerToken}`},
// }

//TODO 5: Write your code here to hit up the /secrets/{id} endpoint

//and get the secret with id of 42

//HINT: This is how you can use axios to do bearer token auth:

// https://stackoverflow.com/a/52645402
/*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
