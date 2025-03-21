import { NextApiRequest, NextApiResponse } from "next";
import Prisma from "../../prismaDb/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {edgeId} = req.body;
    try{
        await Prisma.domainModelEdge.delete({where : {id : edgeId}});
    }catch(e){
        res.json({ message: 'Internal server error.' });
    }
    res.status(200).json({ message: 'Edge deleted successfully.' });
}