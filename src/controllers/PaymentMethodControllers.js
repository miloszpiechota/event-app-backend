import e, { response, request, query } from "express"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import env from "dotenv"
import cryptoJs from "crypto-js"
import { PaymentMethodModels } from "../models/Models"
import { connect } from "http2"

env.config()

const salt = bcryptjs.genSaltSync(10)

//     CREATE PaymentMethod
export const PaymentMethodCreate = async (req = request, res = response) => {
    try {
        const {
            name
        } = await req.body

        const createPaymentMethod = await PaymentMethodModels.create({
            data: {
                name: name,
            },
        })

        return res.status(201).json({
            success: true,
            msg: "PaymentMethod created",
            data: createPaymentMethod,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error,
        })
    }
}

//     READ PaymentMethod
export const PaymentMethodRead = async (req = request, res = response) => {
    try {
        const readPaymentMethod = await PaymentMethodModels.findMany()

        return res.status(200).json({
            success: true,
            msg: "PaymentMethod read",
            data: readPaymentMethod,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error,
        })
    }
}

//     READ PaymentMethod by ID
export const PaymentMethodReadById = async (req = request, res = response) => {
    try {
        const { id } = req.params

        const readPaymentMethod = await PaymentMethodModels.findUnique({
            where: {
                idpayment_method: parseInt(id),
            }
        })

        return res.status(200).json({
            success: true,
            msg: "PaymentMethod read",
            data: readPaymentMethod,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error,
        })
    }
}

//     UPDATE PaymentMethod

export const PaymentMethodUpdate = async (req = request, res = response) => {
    try {
        const {
            name
        } = await req.body
        const { id } = await req.params

        const updatePaymentMethod = await PaymentMethodModels.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name: name,
            },
        })

        return res.status(200).json({
            success: true,
            msg: "PaymentMethod updated",
            data: updatePaymentMethod,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error,
        })
    }
}
//     Delete PaymentMethod
export const PaymentMethodDelete = async (req = request, res = response) => {
    try {
        const { id } = req.params

        const checkId = await PaymentMethodModels.findUnique({
            where: {
                id: parseInt(id),
            }
        })

        if (!checkId) {
            return res.status(404).json({
                success: false,
                message: 'Id not found!',
            })
        }

        const result = await PaymentMethodModels.delete({
            where: {
                id: parseInt(id),
            },
        })

        res.status(201).json({
            success: true,
            msg: "Successfully delete PaymentMethod!",
            PaymentMethod: result,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        })
    }
}