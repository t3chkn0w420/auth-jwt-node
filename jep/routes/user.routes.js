const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get("/api/test/all", controller.allAccess);
  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
//     // Create a new User
//     router.post("/api/auth/create",
//     [verifySignUp.checkDuplicatefullnameOrEmail,
//        verifySignUp.checkRolesExisted],
//     controller.signup
//   );   
       
//     // Retrieve all Users
//     router.get("/api/auth", users.findAll);
    
//     // Retrieve all published Users
//    //  router.get("/published", tutorials.findAllPublished);
    
//     // Retrieve a single Users with id
//     router.get("/:id", users.findOne);
    
//     // Update a Users with id
//     router.put("/:id", users.update);
    
//     // Delete a UsersTutorial with id
//     router.delete("/:id", users.delete);
    
//     // Delete all Users
//     router.delete("/api/auth", users.deleteAll);
    
//     app.use('/api/auth/users', router);


