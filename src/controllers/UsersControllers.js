import { response, request, query } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import env from "dotenv";

import { UsersModels } from "../models/Models";
import { connect } from "http2";
import userTypes from "../config/userTypes";
import { body, validationResult } from 'express-validator';

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

    const token = jwt.sign(
      {
        app_name: "inzynierka",
        id: createUsers.iduser,
        email: createUsers.email,
        username: createUsers.username,
        iduser_type: createUsers.iduser_type,
      },
      process.env.API_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Usuń szyfrowanie tokena
    // const hashToken = cryptoJs.AES.encrypt(token, process.env.API_SECRET).toString();

    res.status(201).json({
      success: true,
      msg: "Successfully created user!",
      token: token, // Zwróć token bezpośrednio
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
     // Walidacja danych wejściowych
     if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password are required!",
      });
    }

    const Usercheck = await UsersModels.findFirst({
      where: { email },
    });

    if (!Usercheck) {
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password!",
      });
      
    }

    const comparePassword = bcryptjs.compareSync(password, Usercheck.password);
    if (!comparePassword) {
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password!",
      });
      
    }

    const token = jwt.sign(
      {
        app_name: "inzynierka",
        id: Usercheck.iduser,
        email: Usercheck.email,
        iduser_type: Usercheck.iduser_type,
      },
      //podpisanie tokena
      process.env.API_SECRET,
      { expiresIn: "10d" }
    );

    // Usuń szyfrowanie tokena
    // const hashToken = cryptoJs.AES.encrypt(token, process.env.API_SECRET).toString();

    res.status(200).json({
      success: true,
      token: token, // Zwróć token bezpośrednio
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "An unexpected error occurred. Please try again.",
    });
  }
};

//      USERS READ ALL (for admin)
export const UsersRead = async (req = request, res = response) => {
  try {
    const { page = 1, limit = 10 } = await req.query;
    let skip = (page - 1) * limit;
    const { filter } = await req.body;
    const result = await UsersModels.findMany({
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { iduser: "desc" },
      where: filter,
    });

    const conn = await UsersModels.count();

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

    // Zakładamy, że 'authCheck' ustawia 'req.user'
    const userIdFromToken = req.user.id;

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

    // Sprawdzenie, czy id z tokenu pokrywa się z id z zapytania
    if (parseInt(id) !== userIdFromToken) {
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
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        msg: "Please log in to access this resource.",
      });
    }
  
    const bearer = token.split(" ")[1];
  
    const verify = jwt.verify(bearer, process.env.API_SECRET);
  
    // Nie ma potrzeby sprawdzania `verify`, ponieważ jeśli token jest nieważny, funkcja rzuci wyjątek.
  
    // Pobranie danych użytkownika
    const getUserData = await UsersModels.findUnique({
      where: { iduser: parseInt(verify.id) },
    });
  
    if (!getUserData) {
      return res.status(404).json({
        success: false,
        msg: "User not found!",
      });
    }
  
    const { password, ...userWithoutPassword } = getUserData;
  
    return res.status(200).json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        msg: "Invalid token.",
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        msg: "Token expired.",
      });
    } else {
      console.error("Authentication error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error.",
      });
    }
  }
  
};