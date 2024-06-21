const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    if (!name) {
        return res.status(422).json({ message: 'Your full names are required' });
    }
    if (!email) {
        return res.status(422).json({ message: 'Your email address is required' });
    }
    if (!password) {
        return res.status(422).json({ message: 'Your password is required' });
    }
    User.findOne({ email: email }).then((user) => {
        if (user) {
            return res.status(422).json({ message: 'The email address already exists' })
        }
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ message: 'An error occured' });
    });

    bcrypt.hash(password, 12).then((hashedPassword) => {
        const newUser = new User({ name, email, password: hashedPassword });
        newUser.save().then((us) => {
            const userObject = { name: us.name, email: us.email, _id: us._id };
            const token = jwt.sign({ email: userObject.email, _id: userObject._id }, 'database', { expiresIn: 60 * 60 });
            return res.status(201).json({ message: 'User registered successfully', token, user: userObject })
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ message: 'An error occured' });
        })
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ message: 'An error occured' });
    });

}

exports.login = () => {}