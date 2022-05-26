module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    fullname: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    user_roles: {
      type: Sequelize.STRING
     },
     image: {
      type: Sequelize.STRING
     }
  });

  return User;
};
