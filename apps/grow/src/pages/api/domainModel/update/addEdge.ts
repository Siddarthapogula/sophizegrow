import { NextApiRequest, NextApiResponse } from 'next';
import Prisma from '../../prismaDb/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body;
  const graph = await Prisma.domainModelGraph.findFirst({
    include: { edges: true },
  });
  if (!graph) {
    return res.status(404).json({ message: 'Graph not found.' });
  }
  const sourceNode = data?.source;
  const targetNode = data?.target;
  const id = `${sourceNode}-${targetNode}`
  if (!sourceNode || !targetNode) {
    return res
      .status(400)
      .json({ message: 'Source and target nodes are required.' });
  }
  try {
    await Prisma.domainModelEdge.create({
      data: {
        id: data?.id??id,
        sourceNodeId: sourceNode,
        targetNodeId: targetNode,
        label: '',
        domainModelGraphId: graph?.id,
      },
    });
  } catch (e) {
    console.log(e);
    res.json({ message: 'error while adding edge.' });
  }
  res.status(200).json({ message: 'Edge created' });
}
