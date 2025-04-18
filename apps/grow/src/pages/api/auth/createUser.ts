import { NextApiRequest, NextApiResponse } from "next";
import Prisma from "../prismaDb/prisma";

export default async function handler(req : NextApiRequest, res : NextApiResponse){
    const {email, displayName} = req.body;
    const isUser = await Prisma.user.findUnique({
        where:{
            email : email
        }
    })
    if(isUser){
        return res.status(400).json({message : 'attempt create user, but it already exists, will fix it later'});
    }
    const newUser = await Prisma.user.create({
        data:{
            email : email,
            name : displayName,
        }
    })
    return res.status(200).json({message : "new user created", userName : displayName});  
}