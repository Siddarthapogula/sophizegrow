import { NextApiRequest, NextApiResponse } from 'next';
import Prisma from './prismaDb/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { certifierId, learnerId, abilityId } = req.body;
  //we will get certifierId from cookie only , will be implemented next
  if (!certifierId || !learnerId || !abilityId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const certification = await Prisma.certification.create({
      data: {
        certifier: { connect: { id: certifierId } },
        learner: { connect: { id: learnerId } },
        ability: { connect: { id: abilityId } },
      },
    });

    return res.status(200).json({ success: true, certification });
  } catch (error) {
    console.error('Error creating certification:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}
