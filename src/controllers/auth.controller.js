const db = require("../models");
const config = require("../configs/auth.config");
const User = db.user;
var md5 = require('md5');
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    password: md5(req.body.password)
  })
    .then(user => {
        res.send({ message: "User was registered successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  console.log(req.body.password);
  const password = md5(req.body.password)
  User.findOne({
    where: {
      [Op.and]:[
        {username: req.body.username},
        {password: password}
      ]
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      return res.status(200).send({
        data: user,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};