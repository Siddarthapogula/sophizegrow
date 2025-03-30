/*
  Warnings:

  - Added the required column `type` to the `domainModelNode` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('NORMAL', 'SUCCESSIVE');

-- DropForeignKey
ALTER TABLE "LearningResource" DROP CONSTRAINT "LearningResource_domainModelNodeId_fkey";

-- AlterTable
ALTER TABLE "domainModelNode" ADD COLUMN     "type" "NodeType" NOT NULL;

-- AddForeignKey
ALTER TABLE "LearningResource" ADD CONSTRAINT "LearningResource_domainModelNodeId_fkey" FOREIGN KEY ("domainModelNodeId") REFERENCES "domainModelNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
