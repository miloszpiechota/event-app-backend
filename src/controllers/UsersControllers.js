import { response, request } from "express"
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
  const Usercheck = await UsersModels.findUnique({
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
  const data = await req.body
  const { id } = await req.params

  const checkUniqueId = await UsersModels.findUnique({
   where: {
    iduser: parseInt(id),
   }
  })

  const checkUniqueEmail = await UsersModels.findUnique({
   where: {
    email: data.email,
   }
  })

  if (!checkUniqueId) {
   return res.status(404).json({
    success: false,
    message: 'Id not found!',
   })
  }

  if (checkUniqueEmail) {
   return res.status(400).json({
    success: false,
    message: 'Email already exist!',
   })
  }


  const result = await UsersModels.update({
   where: {
    iduser: parseInt(id),
   },
   data: {
    email: data.email,
    password: bcryptjs.hashSync(data.password, salt), 
    name: data.name, 
    surname: data.surname,
   },
  })

  res.status(201).json({
   success: true,
   msg: "Successfully update users!",
  })
 } catch (error) {
  res.status(500).json({
   success: false,
   error: error.message,
  })
 }
}

//      USERS DELETE
export const UsersDelete = async (req = request, res = response) => {
 try {
  const { id } = await req.body

  const checkId = await UsersModels.findFirst({
   where: {
    iduser: parseInt(id),
   }
  })

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