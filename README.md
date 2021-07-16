# yummi-pizza-service
This is a Express Js project to provide the rest api for Yummi Pizza website and its admin website.
To run this project need to follow the below steps:
1. Inside the project folder run the command: 
```
$ npm install 
```
2. After installing all packages run : 
```
$ node ./bin/www
```    
to run the project.Then open the url in browser
http://localhost:3000

## Code Overview
### Dependencies
- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [express-jwt](https://github.com/auth0/express-jwt) - Middleware for validating JWTs for authentication
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [express-fileupload](https://www.npmjs.com/package/express-fileupload) - For uploading file 
- [body-parser](https://www.npmjs.com/package/body-parser) - For parsing request body

## Application Structure

- `app.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `config.js` - This file contains configuration for for configuration/environment variables.
- `routes/` - This folder contains the route definitions for our API.
- `models/` - This folder contains the schema definitions for our Mongoose models.
- `services/` - This folder contains the code for all execution of interaction with models and send back the respones to the end point.
- `public/` - This folder contains all static files like css,images etc.
