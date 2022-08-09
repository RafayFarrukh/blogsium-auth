import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const registerUser = async (req, res) => {
  const salt = await bcrypt.genSalt(11);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  newUser.save((err, createdUser) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    createdUser.password = undefined;
    res.json(createdUser);
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({message:"successfully signed in"})
          const token = jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET
          );
          const { _id, name, email } = savedUser;
          res.json({ token, user: { _id, email } });
        } else {
          return res.status(422).json({ error: "Invalid Email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(422).json({ error: "please provide email or password" });
//   }
//   User.findOne({ email: email }).then((savedUser) => {
//     if (!savedUser) {
//       res.status(422).json({ error: "Invalid Email or password" });
//     }
//     bcrypt
//       .compare(password, savedUser.password)
//       .then((doMatch) => {
//         if (doMatch) {
//           const token = jwt.sign(
//             { _id: savedUser._id },
//             process.env.JWT_SECRET
//           );
//           const { _id, username, email } = savedUser;
//           res.json({
//             // savedUser,
//             token,
//             user: { _id, username, email },
//             // user
//           });
//         } else {
//           res.status(422).json({ error: "Invalid Email or password" });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   });
// };
const getalluser = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(404).json({ message: error.stack });
  }
};

export { registerUser, loginUser, getalluser };
