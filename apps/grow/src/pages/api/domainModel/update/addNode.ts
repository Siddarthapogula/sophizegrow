import { NextApiRequest, NextApiResponse } from 'next';
import Prisma from '../../prismaDb/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id, data, position } = req.body;
    if (!id || !data?.label || !position?.x || !position?.y) {
      return res.status(400).json({ message: 'Invalid request body.' });
    }

    const graph = await Prisma.domainModelGraph.findFirst({
      include: { edges: true, nodes: true },
    });
    if (!graph) {
      return res.status(404).json({ message: 'Graph not found.' });
    }
    await Prisma.domainModelNode.create({
      data: {
        id,
        label: data?.label,
        tag: data?.tag,
        positionX: position?.x,
        positionY: position?.y,
        domainModelGraphId: graph?.id,
      },
    });
    res.status(200).json({ message: 'Node created successfully.' });
  } catch (error) {
    console.error('Error creating node:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
