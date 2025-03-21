import { NextApiRequest, NextApiResponse } from "next";
import Prisma from "../../prismaDb/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const resource = req.body;
    console.log(resource);
    await Prisma.learningResource.update({where: {id: resource.id}, data: resource});
    return res.status(200).json({msg: 'resource updated'});
}