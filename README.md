Methods	Urls	Actions
POST	/api/auth/signup	signup new account
POST	/api/auth/signin	login an account
POST	/api/auth/signout	logout the account
GET	/api/test/all	retrieve public content
GET	/api/test/user	access User’s content
GET	/api/test/mod	access Moderator’s content
GET	/api/test/admin	access Admin’s content

AUTHENTICATION ROUTES:
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/signout

Authorization:
GET /api/test/all
GET /api/test/user for loggedin users (user/moderator/admin)
GET /api/test/mod for moderator
GET /api/test/admin for admin

/api/tutorials: GET, POST, DELETE
/api/tutorials/:id: GET, PUT, DELETE
/api/tutorials/published: GET

There are 4 functions:
– /api/test/all for public access
– /api/test/user for loggedin users (role: user/moderator/admin)
– /api/test/mod for users having moderator role
– /api/test/admin for users having admin role

– config

configure MySQL database & Sequelize
configure Auth Key
– routes

auth.routes.js: POST signup, signin & signout
user.routes.js: GET public & protected resources
– middlewares

verifySignUp.js: check duplicate Username or Email
authJwt.js: verify Token, check User roles in database
– controllers

auth.controller.js: handle signup, signin & signout actions
user.controller.js: return public & protected content
– models for Sequelize Models

user.model.js
role.model.js
– server.js: import and initialize necessary modules and routes, listen for connections.

These Sequelize Models represents users & roles table in MySQL database.

After initializing Sequelize, we don’t need to write CRUD functions, Sequelize supports all of them:

create a new User: create(object)
find a User by id: findByPk(id)
find a User by email: findOne({ where: { email: ... } })
get all Users: findAll()
find all Users by username: findAll({ where: { username: ... } })

Register some users with /signup API:
admin with admin role
mod with moderator and user roles
zkoder with user role

{
	"fullname": "Jezekiel Isip",
	"email": "jezedevkiel21@gmail.com",
	"password": "haha123!",
	"roles": ["moderator", "user"]
}

mysql> INSERT INTO roles VALUES (1, 'user', now(), now());
mysql> INSERT INTO roles VALUES (2, 'moderator', now(), now());
mysql> INSERT INTO roles VALUES (3, 'admin', now(), now());

Access protected resources
- GET /api/test/user
- GET /api/test/mod
- GET /api/test/admin

SELECT `id`, `fullname`, `email`, `password`, `role`, `image`, `createdAt`, `updatedAt` FROM `users` WHERE 1 -->