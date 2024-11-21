import { response, request, query } from "express"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import env from "dotenv"
import cryptoJs from "crypto-js"
import { CommentsModels } from "../models/Models"
env.config()

const salt = bcryptjs.genSaltSync(10)
// let time = await prisma.time.create({
//     data: { start: new Date(), end: null, something: 'something' },
//   })

// Create Comments
export const CommentsCreate = async (req = request, res = response) => {
    try {
        const {
            comment,
            iduser,
            idevent,
            date_comment = new Date() // Default to current date if not provided
        } = req.body

        const createComments = await CommentsModels.create({
            data: {
                comment,
                iduser,
                idevent,
                date_comment
            }
        })
        res.status(201).json({
            success: true,
            msg: "Successfully added comment!",
            comment: createComments,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        })
    }
}

// Read Comments
export const CommentsRead = async (req = request, res = response) => {
    const { idevent } = req.query; // Pobiera idevent z zapytania
  
    try {
      const readComments = await CommentsModels.findMany({
        where: {
          idevent: parseInt(idevent),
        },
        select: {
          idcomment: true,
          idevent: true,
          comment: true,
          iduser: true,
          date_comment: true,
        },
      });
  
      res.status(200).json({
        success: true,
        msg: "Successfully read comments!",
        comments: readComments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };

// Delete Comments
export const CommentsDelete = async (req = request, res = response) => {
    try {
        const { id } = req.params
        const deleteComments = await CommentsModels.delete({
            where: {
                idcomment: parseInt(id)
            }
        })

        res.status(200).json({
            success: true,
            msg: "Successfully deleted comment!",
            comment: deleteComments,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        })
    }
}
