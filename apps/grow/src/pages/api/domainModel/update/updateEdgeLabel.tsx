import { NextApiRequest, NextApiResponse } from "next";
import Prisma from "../../prismaDb/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {id, label} = req.body;
    await Prisma.domainModelEdge.update({where : {id : id}, data : {label : label}});
    res.status(200).json({ message: 'Edge label updated successfully.' });
}