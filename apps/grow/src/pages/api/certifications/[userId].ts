import { NextApiRequest, NextApiResponse } from 'next';
import Prisma from '../prismaDb/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  try {
    const certifications = await Prisma.certification.findMany({
      where: {
        learnerId: userId,
      },
    });
    res.status(200).json({ certifications });
  } catch (e) {
    console.error('Error fetching certifications:', e);
    return res
      .status(500)
      .json({ message: 'Unable to fetch certifications from the database' });
  }
}
