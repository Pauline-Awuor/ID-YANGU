const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/mailer");
console.log(sendMail);
const dotenv = require("dotenv");
const forgotPasswordTemplate = require("../utils/templates");
dotenv.config();
const welcomeEmailTemplate = require("../utils/templates");


const CLIENT_URL = process.env.CLIENT_URL; //CLIENT_URL=http://localhost:3000

exports.register = async (req, res) => {

  try{

  const name = req.body.name;

  const email = req.body.email;

  const password = req.body.password;

  if (!name) {

    return res.status(422).json({ message: "Your full names are required" });

  }

  if (!email) {

    return res.status(422).json({ message: "Your email address is required" });

  }

  if (!password) {

    return res.status(422).json({ message: "Your password is required" });

  }




  const foundUser = await User.findOne({ email: email })

    if (foundUser) {

        return res

          .status(422)

          .json({ message: "The email address already exists" });

      }

    

  const hashedPassword = await bcrypt.hash(password, 12)

      const newUser = new User({ name, email, password: hashedPassword });

      newUser.save()

      const userProfile = newUser["_doc"];

          delete userProfile.password;




          //  Generate Access Token

          const accessToken = jwt.sign(

            { email: userProfile.email, _id: userProfile._id },

            process.env.SECRET_KEY,

            {

              expiresIn: "1h",

            }

          );

          //  Generate Refresh Token

          const refreshToken = jwt.sign(

            { email: userProfile.email, _id: userProfile._id },

            process.env.SECRET_KEY,

            {

              expiresIn: "7d",

            }

          );


          const subject = welcomeEmailTemplate()
          await sendMail(email,"Welcome to Fynd",subject);

          return res.status(201).json({

            message: "User registered successfully",

            user: userProfile,

            accessToken,

            refreshToken,

          });

      

    } catch (err) {

      console.log(err);

      return res.status(500).json({ message: "An error occurred" });

    };

};


exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user)
        return res.status(422).json({
          message: "You have entered the wrong credentials. Please try again",
        });
      else if (user) {
        bcrypt
          .compare(password, user.password)
          .then((isCorrect) => {
            if (!isCorrect)
              return res.status(422).json({
                message:
                  "You have entered the wrong credentials. Please try again",
              });
            const userObject = user["_doc"];
            delete userObject.password;
            //  Generate Access Token
            const accessToken = jwt.sign(
              { email: userObject.email, _id: userObject._id },
              process.env.SECRET_KEY,
              {
                expiresIn: "1h",
              }
            );
            //  Generate Refresh Token
            const refreshToken = jwt.sign(
              { email: userObject.email, _id: userObject._id },
              process.env.SECRET_KEY,
              {
                expiresIn: "7d",
              }
            );
            return res.status(200).json({
              message: "Login Success",
              user: userObject,
              accessToken,
              refreshToken,
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: "An error occured" });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "An error occured" });
    });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        return res.status(422).json({
          message:
            "Could not find an account with the entered email. Please try again",
        });
      } else {
        //  Generate Reset Token
        const token = jwt.sign(
          { email: user.email, _id: user._id },
          process.env.SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );

        // Send email with verification token
        const subject = forgotPasswordTemplate(
          `${CLIENT_URL}/auth/reset-password/${token}`
        );
        await sendMail(email, "Reset Password", subject);

        return res
          .status(200)
          .json({ message: "Email sent with password reset instructions" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "An error occurred" });
    });
};

exports.resetPassword = (req, res) => {
  const { password, token } = req.body;

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(422).json({
        message: "Invalid or expired token. Please try again",
      });
    } else {
      User.findOne({ email: decoded.email })
        .then((user) => {
          if (!user) {
            return res.status(422).json({
              message: "User not found. Please try again",
            });
          } else {
            bcrypt
              .hash(password, 10)
              .then((hash) => {
                user.password = hash;
                user
                  .save()
                  .then((user) => {
                    return res
                      .status(200)
                      .json({ message: "Password reset successfully" });
                  })
                  .catch((err) => {
                    console.log(err);
                    return res
                      .status(500)
                      .json({ message: "An error occurred" });
                  });
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json({ message: "An error occurred" });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ message: "An error occurred" });
        });
    }
  });
};
