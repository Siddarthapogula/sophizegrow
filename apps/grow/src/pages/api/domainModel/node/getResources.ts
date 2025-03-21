import { NextApiRequest, NextApiResponse } from "next";
import Prisma from "../../prismaDb/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const nodeId = req.query.nodeId as string;
    if (nodeId === undefined) {
        return res.status(400).json({ error: "nodeId is required." });
    }
    const resources = await Prisma.learningResource.findMany({
        where: {
            domainModelNodeId: nodeId,
        }
    });
    return res.status(200).json(resources);
}