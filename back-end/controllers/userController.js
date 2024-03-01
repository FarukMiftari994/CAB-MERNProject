import { isValidObjectId } from "mongoose";
import { UserModel } from "../models/userModel.js";
import PlayersModel from "../models/playersModel.js";
import { encryptPassword, verifyPassword } from "../utils/encryptPassword.js";
import { generateToken } from "../utils/tokenServices.js";
// import bcrypt from "bcrypt";

const getUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find({}).select("-password");
    // .populate({
    //   path: "players",
    // });
    res.status(200).json(allUsers);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "server error" });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const foundUser = await UserModel.findOne({ email: req.params.email });
    if (foundUser) {
      return res.status(200).json(foundUser);
    } else {
      res.status(404).json({ error: "No user found" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "e" });
  }
};

const signup = async (req, res) => {
  console.log(req.body);
  const { email, password, username, favPlayer } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "All fields must be included" });
  try {
    const existingUser = await UserModel.findOne({ email: email });
    console.log("existingUser :>> ", existingUser);

    if (existingUser) {
      res.status(400).json({ error: "Email already registered" });
    }

    if (!existingUser) {
      try {
        // console.log("encopndiong password");

        const hashedPassword = await encryptPassword(password);
        console.log("hashedPassword :>> ", hashedPassword);
        if (!hashedPassword) {
          res.status(500).json({
            message: "Problem encoding password",
          });
        }

        if (hashedPassword) {
          const newUser = await UserModel.create({
            email: email,
            password: hashedPassword,
            username: username,
            favPlayer: favPlayer,
          });

          console.log("newUser :>> ", newUser);
          if (newUser) {
            res.status(201).json({
              message: "User Registered",
              user: {
                email: newUser.email,
                username: newUser.username,
                favPlayer: newUser.favPlayer,
              },
            });
          } else {
            res.status(400).json({ error: "User couldnt be created" });
          }
        }
      } catch (error) {
        console.log("Something very bad happened");
      }
    }
  } catch (error) {
    console.log(error);
    if (error.code === 11000)
      res.status(400).json({ error: "Email already registered" });
    // res.status(500).json({ error: "Something went wrong" });
  }
};

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password)
//     return res.status(400).json({ error: "All fields must be included" });
//   try {
//     const foundUser = await UserModel.findOne({ email });
//     if (!foundUser) {
//       return req.status(500).json({ error: "Something went wrong" });
//     }
//     const match = await bcrypt.compare(password, foundUser.password);
//     if (match) {
//       const user = {
//         _id: foundUser._id,
//         email: foundUser.email,
//         username: foundUser.username,
//         createAt: foundUser.createdAt,
//       };
//       return res.status(200).json(user);
//     } else res.status(400).json({ error: "Password incorrect" });
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ error: "No user exist with that email" });
//   }
// };

const login = async (req, res) => {
  //! 1. Check that required fileds are coming in the req.body

  if (!req.body.password || !req.body.email) {
    console.log("No credentials");
    res.status(500).json({
      message: "Required fileds missing",
      error: true,
      data: null,
    });
  }

  //! 2. Check if any user with the same email exists in our DB
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });
    console.log("existingUser", existingUser);

    //! A. There is no user in our DB
    if (!existingUser) {
      res.status(500).json({
        message: "User not registered",
        error: true,
        data: null,
      });
    }

    //! B. There is a user
    if (existingUser) {
      //? B.1 Verify Password

      const correctPassword = await verifyPassword(
        req.body.password,
        existingUser.password
      );

      //? C.1 Password do not match
      if (!correctPassword) {
        res.status(500).json({
          message: "Incorrect Password",
          error: true,
          data: null,
        });
      }

      //? C.2 Passwords match
      if (correctPassword) {
        //? D Generate Token

        const token = generateToken(existingUser._id);

        //? D.1 token is not generated

        if (!token) {
          res.status(500).json({
            message: "something went wrong generating the token",
            error: true,
            data: null,
          });
        }

        //? D.2 token is generated

        if (token) {
          const user = {
            // username: existingUser.username,
            email: existingUser.email,
          };

          res.status(200).json({
            message: "User logged in",
            error: false,
            data: {
              user: user,
              token,
            },
          });
        }
      }
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Went Worng", error: true, data: null });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const valid = isValidObjectId(id);
  console.log(valid);
  if (!valid) return res.status(400).json({ error: "ID MISSING" });
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const updateUserList = async (req, res) => {
  console.log("req.body :>> ", req.body);
  const {
    userId,
    playerId,
    name,
    overall,
    position,
    pace,
    shooting,
    passing,
    dribbling,
    defense,
    physicality,
    image,
  } = req.body;
  //! when we make this route authorize (sending the token in the request), we wont need to receive the ID in the request,
  //! because we will receive the user information thanks to the Token and Passport

  // UserModel.findByIdAndDelete(playerId);
  try {
    const updateUserWithPlayer = await UserModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          favPlayer: {
            _id: playerId,
            name: name,
            overall: overall,
            position: position,
            pace: pace,
            shooting: shooting,
            passing: passing,
            dribbling: dribbling,
            defense: defense,
            physicality: physicality,
            image: image,
          },
        },
      },

      { new: true }
    ).populate({ path: "favPlayer" });

    const updatePlayerWithUser = await PlayersModel.findByIdAndUpdate(
      playerId,
      { playerOwner: userId },
      { new: true }
    ).populate({ path: "playerOwner" });

    const updatePlayer = await PlayersModel.findByIdAndUpdate(
      playerId,
      req.body,
      {
        new: true,
      }
    );
    res.status(201).json({
      updateUserWithPlayer,
      updatePlayerWithUser,
      updatePlayer,
    });
  } catch (error) {
    console.log("error :>> ", error);
  }
};

export { getUsers, getUserByEmail, signup, login, updateUser, updateUserList };
