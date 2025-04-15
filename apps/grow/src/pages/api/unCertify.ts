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
    const existingCert = await Prisma.certification.findFirst({
      where: {
        learnerId,
        abilityId,
        certifierId,
      },
    });

    if (!existingCert) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    const deletedCert = await Prisma.certification.delete({
      where: { id: existingCert.id },
    });

    return res.status(200).json({
      success: true,
      message: 'Certification removed',
      certification: deletedCert,
    });
  } catch (error) {
    console.error('Error deleting certification:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}
