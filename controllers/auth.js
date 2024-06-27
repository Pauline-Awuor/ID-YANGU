const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
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
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res
          .status(422)
          .json({ message: "The email address already exists" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "An error occured" });
    });

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const newUser = new User({ name, email, password: hashedPassword });
      newUser
        .save()
        .then((us) => {
          const userObject = { name: us.name, email: us.email, _id: us._id };
          const token = jwt.sign(
            { email: userObject.email, _id: userObject._id },
            "database",
            { expiresIn: 60 * 60 }
          );
          return res
            .status(201)
            .json({
              message: "User registered successfully",
              token,
              user: userObject,
            });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ message: "An error occured" });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "An error occured" });
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user)
        return res
          .status(422)
          .json({
            message: "You have entered the wrong credentials. Please try again",
          });
      else if (user) {
        bcrypt
          .compare(password, user.password)
          .then((isCorrect) => {
            if (!isCorrect)
              return res
                .status(422)
                .json({
                  message:
                    "You have entered the wrong credentials. Please try again",
                });
            const userObject = {
              name: user.name,
              email: user.email,
              _id: user._id,
            };
            const token = jwt.sign(
              { email: userObject.email, _id: userObject._id },
              "database",
              { expiresIn: 60 * 60 }
            );
            return res
              .status(200)
              .json({ message: "Login Success", token, userObject });
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

exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res
            .status(422)
            .json({
              message:
                "Could not find an account with the entered email. Please try again",
            });
        } else {
          const token = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: 60 * 60 } // 1 hour
          );
  
          // Send email with verification token
          const transporter = nodemailer.createTransport({
            host: 'your-smtp-host',
            port: 587,
            secure: false, // or 'STARTTLS'
            auth: {
              user: 'your-email-username',
              pass: 'your-email-password'
            }
          });
  
          const mailOptions = {
            from: 'your-email-username',
            to: user.email,
            subject: 'Reset Password',
            text: `Hello,
  
  Click on this link to reset your password: http://localhost:3000/reset-password/${token}
  
  Best regards,
  Your App Name`
          };
  
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Email sent: ' + info.response);
          });
  
          return res
            .status(200)
            .json({ message: 'Email sent with password reset instructions' });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: 'An error occurred' });
      });
  };
  
  exports.resetPassword = (req, res) => {
    const { password, token } = req.body;
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(422)
          .json({
            message: 'Invalid or expired token. Please try again',
          });
      } else {
        User.findOne({ email: decoded.email })
          .then((user) => {
            if (!user) {
              return res
                .status(422)
                .json({
                  message: 'User not found. Please try again',
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
                        .json({ message: 'Password reset successfully' });
                    })
                    .catch((err) => {
                      console.log(err);
                      return res.status(500).json({ message: 'An error occurred' });
                    });
                })
                .catch((err) => {
                  console.log(err);
                  return res.status(500).json({ message: 'An error occurred' });
                });
            }
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: 'An error occurred' });
          });
      }
    });
  };
