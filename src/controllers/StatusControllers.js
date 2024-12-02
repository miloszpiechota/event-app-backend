import { response, request, query } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import env from "dotenv";
import cryptoJs from "crypto-js";
import { StatusModels } from "../models/Models";
import { connect } from "http2";
// import userTypes from "../config/userTypes";
import { body, validationResult } from 'express-validator';

env.config()

const salt = bcryptjs.genSaltSync(10)

export const StatusReadById = async (req = request, res = response) => {
    try {
        const { id } = req.params

        const readStatusById = await StatusModels.findUnique({
            where: {
                idstatus_type: parseInt(id),
            },
        })

        return res.status(200).json({
            success: true,
            msg: "Status read by id",
            data: readStatusById,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error,
        })
    }
}

export const StatusReadAll = async (req = request, res = response) => { 
    try {
        const readStatusAll = await StatusModels.findMany()

        return res.status(200).json({
            success: true,
            msg: "Status read all",
            data: readStatusAll,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error,
        })
    }
}
