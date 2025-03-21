import { NextApiRequest, NextApiResponse } from "next";
import Prisma from "../../prismaDb/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {resourceId} = req.body;
    
    if (resourceId === undefined) {
        return res.status(400).json({ error: "resourceId and nodeId are required." });
    }
    await Prisma.learningResource.delete({
        where: {
            id: resourceId,
        }
    });
    res.status(200).json({msg: 'resource deleted'});
}