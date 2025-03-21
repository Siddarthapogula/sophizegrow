import { NextApiRequest, NextApiResponse } from 'next';
import Prisma from '../../prismaDb/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { nodeId } = req.body;
  try {
    await Prisma.domainModelNode.delete({ where: { id: nodeId } });
  } catch (e) {
    res.json({ message: 'Internal server error.' });
  }
  res.status(200).json({ message: 'Node deleted successfully.' });
}
