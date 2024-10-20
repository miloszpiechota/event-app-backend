import { response, request, query } from "express"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import env from "dotenv"
import cryptoJs from "crypto-js"
import { UsersModels } from "../models/Models"
env.config()

const salt = bcryptjs.genSaltSync(10)


//      CREATE USERS
export const UsersCreate = async (req = request, res = response) => {
 try {
  const {
    name,
    second_name,
    surname,
    FK_iduser_type,
    email,
    phonenumber,
    zipcode,
    street,
    FK_idcity,
    password
  } = await req.body
  const checkUniqueEmail = await UsersModels.findFirst({
    where: {
      email: email,  // Finds the first user with this email
    },
  });
  

  if (checkUniqueEmail) {
   return res.status(401).json({
    success: false,
    msg: "email already exist",
   })
  }


  const createUsers = await UsersModels.create({
   data: {
    name: name,
    second_name: second_name,
    surname: surname,
    FK_iduser_type: FK_iduser_type,
    email: email,
    phonenumber: phonenumber,
    zipcode: zipcode,
    street: street,
    FK_idcity: FK_idcity,
    password: bcryptjs.hashSync(password, salt)
    
   },
  })

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
  )

  const hashToken = await cryptoJs.AES.encrypt(token, process.env.API_SECRET).toString()

  res.status(201).json({
   success: true,
   msg: "Successfully created users!",
   token: hashToken,
  })
 } catch (error) {
  res.status(500).json({
   success: false,
   error: error.message,
  })
 }
}

//      USERS LOGIN
export const UsersLogin = async (req = request, res = response) => {
 try {
  const { email, password } = await req.body
  const Usercheck = await UsersModels.findFirst({
   where: {
    email: email,
   },
  })

  if (!Usercheck) {
   res.status(401).json({
    success: false,
    msg: "Email Not Found!",
   })
   return
  }

  const comparePassword = await bcryptjs.compareSync(password, Usercheck.password)

  const token = await jwt.sign(
   {
    app_name: "inzynierka",
    id: Usercheck.iduser,
    email: Usercheck.email,
   },
   process.env.API_SECRET,
   {
    expiresIn: "10d",
   }
  )

  const hashToken = await cryptoJs.AES.encrypt(token, process.env.API_SECRET).toString()

  res.setHeader("Access-Controll-Allow-Origin", "*")

  res.status(200).json({
   success: true,
   token: hashToken,
  })
 } catch (error) {
  res.status(500).json({
   success: false,
   error: error.message,
  })
 }
}

//      USERS READ ALL (for admin)
export const UsersRead = async (req = request, res = response) => {
 try {
  const { page = 1, limit = 10 } = await req.query
  let skip = (page - 1) * limit
  const { filter } = await req.body
  const result = await UsersModels.findMany({
   skip: parseInt(skip),
   take: parseInt(limit),
   orderBy: { iduser: "desc" },
   where: filter,
  })

  const conn = await UsersModels.count()

  res.status(200).json({
   success: true,
   current_page: parseInt(page),
   total_page: Math.ceil(conn / limit),
   total_data: conn,
   query: result,
  })
 } catch (error) {
  res.status(500).json({
   success: false,
   error: error.message,
  })
 }
}


//      USERS UPDATE

export const UsersUpdate = async (req = request, res = response) => {
  try {
    const { email, password, name, surname } = req.body;
    const { id, FK_iduser_type, FK_idcity } = req.params;  // Zakładam, że te parametry są przekazywane w URL

    // Sprawdzenie, czy użytkownik istnieje
    const checkUniqueId = await UsersModels.findUnique({
      where: {
        iduser_FK_iduser_type_FK_idcity: {
          iduser: parseInt(id),
          FK_iduser_type: parseInt(FK_iduser_type),
          FK_idcity: parseInt(FK_idcity),
        },
      },
    });

    if (!checkUniqueId) {
      return res.status(404).json({
        success: false,
        message: 'User ID not found!',
      });
    }

    // Sprawdzenie, czy email jest unikalny
    const checkUniqueEmail = await UsersModels.findFirst({
      where: {
        email,
      },
    });

    if (checkUniqueEmail && checkUniqueEmail.iduser !== parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists!',
      });
    }

    // Aktualizacja użytkownika
    const result = await UsersModels.update({
      where: {
        iduser_FK_iduser_type_FK_idcity: {
          iduser: parseInt(id),
          FK_iduser_type: parseInt(FK_iduser_type),
          FK_idcity: parseInt(FK_idcity),
        },
      },
      data: {
        email,
        password: bcryptjs.hashSync(password, salt), // Hashowanie hasła
        name,
        surname,
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
  const { id } = req.params

  const checkId = await UsersModels.findUnique({
    where: {
      iduser: {
        iduser: parseInt(id),
    },
  }})

  if (!checkId) {
   return res.status(404).json({
    success: false,
    message: 'Id not found!',
   })
  }

  const result = await UsersModels.delete({
   where: {
    iduser: parseInt(id),
   },
  })

  res.status(201).json({
   success: true,
   msg: "Successfully delete users!",
   user: result,
  })
 } catch (error) {
  res.status(500).json({
   success: false,
   error: error.message,
  })
 }
}

//  USER AUTH
export const UserAuth = async (req = request, res = response) => {
 try {
  const token = await req.headers.authorization
  if (!token) {
   res.status(401).json({
    success: false,
    msg: "Login first to get tokens ?",
   })
   return res.status(401).json({
    success: false,
    error: "Token tidak ditemukan",
   })
  }
  const bearer = await token.split(" ")[1]

  const decToken = await cryptoJs.AES.decrypt(bearer, process.env.API_SECRET).toString(cryptoJs.enc.Utf8)

  const verify = await jwt.verify(decToken, process.env.API_SECRET)

  if (!verify) {
   res.status(401).json({
    success: false,
    msg: "Login first to get tokens ?",
   })
   return res.status(401).json({
    success: false,
    error: "Error",
   })
  }

  if (verify.exp < Date.now() / 1000) {
   res.status(401).json({
    success: false,
    msg: "Token Expirited",
   })
   return res.status(401).json({
    success: false,
    error: "Token Expirited",
   })
  }

  const getUserData = await UsersModels.findUnique({
   where: {
    iduser: parseInt(verify.id)
   }
  })

//   const removePass = delete getUserData.password

//   return res.status(200).json({
//    success: true,
//    query: getUserData
//   })
//  } catch (error) {
//   res.status(500).json({
//    success: false,
//    error: error.message,
//   })
//  }
// }


if (!getUserData) {
    return res.status(404).json({
     success: false,
     msg: "User not found!",
    });
   }
 
   const { password, ...userWithoutPassword } = getUserData; // Usunięcie hasła z odpowiedzi
 
   return res.status(200).json({
    success: true,
    query: userWithoutPassword,
   });
  } catch (error) {
   res.status(500).json({
    success: false,
    error: error.message,
   });
  }
 };