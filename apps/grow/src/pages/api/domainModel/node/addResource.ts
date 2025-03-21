import { NextApiRequest, NextApiResponse } from 'next';
import Prisma from '../../prismaDb/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { nodeId, title, description, url } = req.body;
  if(nodeId === undefined || title === undefined){
    return res.status(400).json({ error: 'nodeId and title are required.' });
  }
  let resource;
  try {
    resource = await Prisma.learningResource.create({
      data: {
        title,
        description,
        url,
        domainModelNodeId: nodeId,
      },
    });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
    return res.status(200).json({resource});
}
