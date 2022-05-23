– config

configure MySQL database & Sequelize
configure Auth Key
– routes

auth.routes.js: POST signup & signin
user.routes.js: GET public & protected resources
– middlewares

verifySignUp.js: check duplicate Username or Email
authJwt.js: verify Token, check User roles in database
– controllers

auth.controller.js: handle signup & signin actions
user.controller.js: return public & protected content
– models for Sequelize Models

user.model.js
role.model.js
– server.js: import and initialize necessary modules and routes, listen for connections."# auth-jwt-node" 
