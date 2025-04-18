-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('NORMAL', 'SUCCESSIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "certifierId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "abilityId" TEXT NOT NULL,
    "certifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domainModelGraph" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "domainModelGraph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domainModelNode" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "NodeType" NOT NULL,
    "description" TEXT,
    "tag" TEXT,
    "positionX" DOUBLE PRECISION NOT NULL,
    "positionY" DOUBLE PRECISION NOT NULL,
    "domainModelGraphId" TEXT NOT NULL,

    CONSTRAINT "domainModelNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domainModelEdge" (
    "id" TEXT NOT NULL,
    "label" TEXT,
    "sourceNodeId" TEXT NOT NULL,
    "targetNodeId" TEXT NOT NULL,
    "domainModelGraphId" TEXT NOT NULL,

    CONSTRAINT "domainModelEdge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domainModelNodeId" TEXT NOT NULL,

    CONSTRAINT "LearningResource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_certifierId_fkey" FOREIGN KEY ("certifierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "domainModelNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domainModelNode" ADD CONSTRAINT "domainModelNode_domainModelGraphId_fkey" FOREIGN KEY ("domainModelGraphId") REFERENCES "domainModelGraph"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domainModelEdge" ADD CONSTRAINT "domainModelEdge_domainModelGraphId_fkey" FOREIGN KEY ("domainModelGraphId") REFERENCES "domainModelGraph"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domainModelEdge" ADD CONSTRAINT "domainModelEdge_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "domainModelNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domainModelEdge" ADD CONSTRAINT "domainModelEdge_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "domainModelNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningResource" ADD CONSTRAINT "LearningResource_domainModelNodeId_fkey" FOREIGN KEY ("domainModelNodeId") REFERENCES "domainModelNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
