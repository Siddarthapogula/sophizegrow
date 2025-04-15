import type { NextApiRequest, NextApiResponse } from 'next';
import Prisma from './prismaDb/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const users = await Prisma.user.findMany();
    return res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}
