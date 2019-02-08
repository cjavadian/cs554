/*
* Catherine Javadian
* CS 554
* Lab 1
* I pledge my honor that I have abided by the Stevens Honor System.
*/

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const configRoutes = require("./routes");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware 1
// The first will log all request bodies
// as well as the url path they are requesting
// and the HTTP verb they are using to make the request
app.use(function(request, response, next) {
  console.log("*****MIDDLEWARE 1*******\n");
  console.log("Request BODY: ", request.body);
  console.log("Request URL: ", request.originalUrl);
  console.log("Request HTTP VERB: ", request.method);
  console.log("\n");
  next();
});

// Middleware 2
// The second will keep track of many times a particular URL has been requested,
// updating and logging with each request.
const pathsAccessed = {};
app.use(function(request, response, next)  {
  console.log("*****MIDDLEWARE 2*******\n");
  // Taken from Prof. Barresi's lecture code
  if (!pathsAccessed[request.path]) pathsAccessed[request.path] = 0;
  pathsAccessed[request.path]++;
  console.log(
    "There have now been " +
      pathsAccessed[request.path] +
      " request(s) made to " +
      request.path + "\n"
  );
  console.log("Here is all of the requests you have made: \n", pathsAccessed);
  console.log("\n");
  next();
});


configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});

