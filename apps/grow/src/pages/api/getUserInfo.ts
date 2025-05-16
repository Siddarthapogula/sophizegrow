import { NextApiRequest, NextApiResponse } from "next";
import Prisma from "./prismaDb/prisma";


export default async function handler(req : NextApiRequest, res : NextApiResponse){
    const {userEmail } = req.query;
    const user = await Prisma.user.findUnique({
        where: {
            email: userEmail as string,
        },
    })
    if(!user)return res.json({message: "User not found"});
    return res.status(200).json(user);
}