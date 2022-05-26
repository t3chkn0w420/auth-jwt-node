const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;

// const User = db.user;
// const Role = db.role;
const { user: User, role: Role, refreshToken: RefreshToken } = db;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// exports.signup = (req, res) => {
//   // Save User to Database
//   User.create({
//     fullname: req.body.fullname,
//     email: req.body.email,
//     role: req.body.role,
//     image: req.body.image,
//     password: bcrypt.hashSync(req.body.password, 8)
//   })
//     .then(user => {
//       if (req.body.roles) {
//         Role.findAll({
//           where: {
//             name: {
//               [Op.or]: req.body.roles
//             }
//           }
//         }).then(roles => {
//           user.setRoles(roles).then(() => {
//             res.send({ message: "User was registered successfully! 😎" });
//           });
//         });
//       } else {
//         // user role = 1
//         user.setRoles([1]).then(() => {
//           res.send({ message: "User was registered successfully! 😘" });
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({ message: err.message });
//     });
// };
// exports.signin = (req, res) => {
//   User.findOne({
//     where: {
//       email: req.body.email
//     }
//   })
//     .then(async (user) => {
//       if (!user) {
//         return res.status(404).send({ message: "User Not found 😑😑."});
//       }
//       const passwordIsValid = bcrypt.compareSync(
//         req.body.password,
//         user.password
//       );
      
//       if (!passwordIsValid) {
//         return res.status(401).send({
//           accessToken: null,
//           message: "Invalid Password! 😯"
//         });
//       }
      
//       const token = jwt.sign({ id: user.id }, config.secret, {
//         expiresIn: 86400 // 24 hours
//         // expiresIn: config.jwtExpiration
//       });
      
//       let refreshToken = await RefreshToken.createToken(user);
//       let authorities = [];
      
//       user.getRoles().then(roles => {
//         for (let i = 0; i < roles.length; i++) {
//           authorities.push("ROLE_" + roles[i].name.toUpperCase());
//         }
//         res.status(200).send({
//           id: user.id,
//           fullname: user.fullname,
//           email: user.email,
//           image: user.image,
//           role: authorities,
//           accessToken: token,
//           refreshToken: refreshToken,
//         });
//       });
//     })
//     .catch(err => {
//       res.status(500).send({ message: err.message });
//     });
// };

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }
    req.session.token = token;
    return res.status(200).send({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      image: user.image,
      role: authorities,
      accessToken: token,
      RefreshToken: RefreshToken,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
exports.signup = async (req, res) => {
  // Save User to Database
  try {
    const user = await User.create({
      fullname: req.body.fullname,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });
      const result = user.setRoles(roles);
      if (result) res.send({ message: "User registered successfully!" });
    } else {
      // user has role = 1
      const result = user.setRoles([1]);
      if (result) res.send({ message: "User registered successfully!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};
exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }
  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });
    console.log(refreshToken)
    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }
    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};