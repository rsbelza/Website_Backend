const User = require("../models/User");
const bcrypt = require('bcrypt');
const auth = require("../auth");
const {verify, verifyAdmin} = require("../auth");

module.exports.registerUser = (req, res) => {
    if (!req.body.email.includes("@")) {
        return res.status(400).send({ error: "Email invalid" });
    }
    else if (req.body.mobileNo.length !== 11) {
        return res.status(400).send({ error: "Mobile number invalid" });
    }
    else if (req.body.password.length < 8) {
        return res.status(400).send({ error: "Password must be at least 8 characters" });
    } else {
        User.findOne({ email: req.body.email })
            .then(existingUser => {
                if (existingUser) {
                    return res.status(400).send({ error: "Email already exists" });
                } else {
                    let newUser = new User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        mobileNo: req.body.mobileNo,
                        password: bcrypt.hashSync(req.body.password, 10)
                    });
                    newUser.save()
                        .then((user) => res.status(201).send({ user, message: "Registered Successfully" }))
                        .catch(err => {
                            console.error("Error in saving: ", err);
                            return res.status(500).send({ error: "Error in save" });
                        });
                }
            })
            .catch(err => {
                console.error("Error in finding user: ", err);
                return res.status(500).send({ error: "Error in finding user" });
            });
    }
};

module.exports.loginUser = (req, res) => {
    if(req.body.email.includes("@")){
        User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                return res.status(404).send({ error: "No Email Found" });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {                    
                    return res.status(200).send({result, access : auth.createAccessToken(result)})
                } else {
                    return res.status(401).send({ message: "Email and password do not match" });
                }
            }
        })
        .catch(err => {
            console.error("Error in find: ", err)
            return res.status(500).send({ error: "Error in find"})
        })
        }
        else {
            return res.status(400).send({error: "Invalid Email"})
        }
};

// Set as Admin
module.exports.setAdmin = (req, res) => {
    let updateActiveField = {
        isAdmin: true
    }
    if (req.user.isAdmin == true){
      return User.findByIdAndUpdate(req.params.userId, updateActiveField)
      .then(setAdmin => {
          if (!setAdmin) {
              return res.status(404).send({ error: "Failed to set user as admin"});
          } 
             return res.status(200).send({ message: "User is now an admin"});
      })
    }
    else {
      return res.status(403).send(false);
      }
};

// Retrieve User Details
module.exports.retrieveUser = (req, res) => {
    const userId = req.user.id;
    User.findById(userId)
    .then(user => {
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        user.password = undefined;
        return res.status(200).send({ user });
    })
    .catch(err => {
        console.error("Error in fetching user profile", err)
        return res.status(500).send({ error: 'Failed to fetch user profile' })
    });
};

// Update Password
module.exports.updatePassword = async (req, res) => {
    try {
    const { newPassword } = req.body;
    const { id } = req.user; // Extracting user ID from the authorization header

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the user's password in the database
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Sending a success response
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};
