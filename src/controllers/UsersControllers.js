import { response, request, query } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import env from "dotenv";
import cryptoJs from "crypto-js";
import { UsersModels, UserTypesModels } from "../models/Models";
import { connect } from "http2";
// import userTypes from "../config/userTypes";
import { body, validationResult } from "express-validator";

env.config();

const salt = bcryptjs.genSaltSync(10);

//      CREATE USERS
export const UsersCreate = async (req = request, res = response) => {
  try {
    const {
      name,
      second_name,
      surname,
      iduser_type,
      email,
      phonenumber,
      zipcode,
      street,
      idcity,
      password,
    } = await req.body;
    const checkUniqueEmail = await UsersModels.findFirst({
      where: {
        email: email, // Finds the first user with this email
      },
    });

    if (checkUniqueEmail) {
      return res.status(401).json({
        success: false,
        msg: "email already exist",
      });
    }

    const createUsers = await UsersModels.create({
      data: {
        name: name,
        second_name: second_name,
        surname: surname,
        iduser_type: iduser_type,
        email: email,
        phonenumber: phonenumber,
        zipcode: zipcode,
        street: street,
        idcity: idcity,
        password: bcryptjs.hashSync(password, salt),
      },
    });

    const token = await jwt.sign(
      {
        app_name: "inzynierka",
        id: createUsers.iduser,
        email: createUsers.email,
        username: createUsers.username,
      },
      process.env.API_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const hashToken = await cryptoJs.AES.encrypt(
      token,
      process.env.API_SECRET
    ).toString();

    res.status(201).json({
      success: true,
      msg: "Successfully created users!",
      token: hashToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//      USERS LOGIN
export const UsersLogin = async (req = request, res = response) => {
  try {
    const { email, password } = req.body;

    const Usercheck = await UsersModels.findFirst({
      where: { email },
    });

    if (!Usercheck) {
      return res.status(401).json({
        success: false,
        msg: "Email not found!",
      });
    }

    const comparePassword = bcryptjs.compareSync(password, Usercheck.password);
    if (!comparePassword) {
      return res.status(401).json({
        success: false,
        msg: "Incorrect password!",
      });
    }

    const token = jwt.sign(
      {
        app_name: "inzynierka",
        id: Usercheck.iduser,
        email: Usercheck.email,
        iduser_type: Usercheck.iduser_type,
      },
      process.env.API_SECRET,
      { expiresIn: "10d" }
    );

    const hashToken = cryptoJs.AES.encrypt(
      token,
      process.env.API_SECRET
    ).toString();

    res.status(200).json({
      success: true,
      token: hashToken,
      iduser: Usercheck.iduser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//      USERS READ ALL (for admin)
export const UsersRead = async (req = request, res = response) => {
  try {
    const { page = 1, limit = 10 } = await req.query;
    let skip = (page - 1) * limit;
    const { filter } = await req.body;
    console.log("4");
    const result = await UsersModels.findMany({
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { iduser: "desc" },
      where: filter,
    });
    console.log("5");

    const conn = await UsersModels.count();
    console.log("6");

    res.status(200).json({
      success: true,
      current_page: parseInt(page),
      total_page: Math.ceil(conn / limit),
      total_data: conn,
      query: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
//      USER READ ONE (for user or admin/moderator)
export const UserRead = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const token = await req.headers["authorization"];
    //deszyfrowanie tokenu JWT
    const decToken = await cryptoJs.AES.decrypt(
      token.split(" ")[1],
      process.env.API_SECRET
    ).toString(cryptoJs.enc.Utf8);
    //rozkodowanie tokenu JWT
    const verify = await jwt.verify(decToken, process.env.API_SECRET);
    // Sprawdzenie, czy użytkownik istnieje
    const user = await UsersModels.findUnique({
      where: {
        iduser: parseInt(id),
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User ID not found!",
      });
    }
    //sprawdzenie czy id z tokenu pokrywa się z id z zapytania
    if (parseInt(id) !== verify.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    res.status(200).json({
      success: true,
      message: "Successfully selected user!",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//      USERS UPDATE

export const UsersUpdate = async (req = request, res = response) => {
  try {
    const {
      name,
      second_name,
      surname,
      email,
      phonenumber,
      zipcode,
      street,
      idcity,
    } = req.body;
    const { id } = req.params; // Zakładam, że te parametry są przekazywane w URL

    // Sprawdzenie, czy użytkownik istnieje
    const checkUniqueId = await UsersModels.findUnique({
      where: {
        iduser: parseInt(id),
      },
    });

    if (!checkUniqueId) {
      return res.status(404).json({
        success: false,
        message: "User ID not found!",
      });
    }

    // Sprawdzenie, czy email jest unikalny
    const checkUniqueEmail = await UsersModels.findFirst({
      where: {
        email,
      },
    });
    const existingUser = await UsersModels.findUnique({
      where: { iduser: parseInt(id) },
    });
    if (checkUniqueEmail && checkUniqueEmail.iduser !== parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: "Email already exists!",
      });
    }

    // Aktualizacja użytkownika
    const result = await UsersModels.update({
      where: {
        iduser: parseInt(id),
      },
      data: {
        name: name || existingUser.name,
        second_name: second_name || existingUser.second_name,
        surname: surname || existingUser.surname,
        email: email || existingUser.email,
        phonenumber: phonenumber || existingUser.phonenumber,
        zipcode: zipcode || existingUser.zipcode,
        street: street || existingUser.street,
        idcity: idcity || existingUser.idcity,
        // password: bcryptjs.hashSync(password, salt) || existingUser.password, // Hashowanie hasła
      },
    });

    res.status(200).json({
      success: true,
      message: "Successfully updated user!",
      user: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const UsersDelete = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const checkId = await UsersModels.findUnique({
      where: {
        iduser: parseInt(id),
      },
    });

    if (!checkId) {
      return res.status(404).json({
        success: false,
        message: "Id not found!",
      });
    }

    const result = await UsersModels.delete({
      where: {
        iduser: parseInt(id),
      },
    });

    res.status(201).json({
      success: true,
      msg: "Successfully delete users!",
      user: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//  USER AUTH
// User Authentication Check
export const UserAuth = async (req = request, res = response) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Login first to get tokens?",
      });
    }

    const bearer = token.split(" ")[1];
    const decToken = cryptoJs.AES.decrypt(
      bearer,
      process.env.API_SECRET
    ).toString(cryptoJs.enc.Utf8);
    const verify = jwt.verify(decToken, process.env.API_SECRET);

    if (!verify) {
      return res.status(401).json({
        success: false,
        msg: "Invalid token.",
      });
    }

    if (verify.exp < Date.now() / 1000) {
      return res.status(401).json({
        success: false,
        msg: "Token expired.",
      });
    }

    const getUserData = await UsersModels.findUnique({
      where: { iduser: parseInt(verify.id) },
    });

    if (!getUserData) {
      return res.status(404).json({
        success: false,
        msg: "User not found!",
      });
    }

    const { password, ...userWithoutPassword } = getUserData; // Remove password from response

    return res.status(200).json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const UserTypesRead = async (req = request, res = response) => {
  try {
    const user_types = await UserTypesModels.findMany();

    if (!user_types) {
      return res
        .status(404)
        .json({ success: false, error: "user_types not found" });
    }

    res.status(200).json({ success: true, data: { user_types: user_types } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
