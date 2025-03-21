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

-- AddForeignKey
ALTER TABLE "domainModelNode" ADD CONSTRAINT "domainModelNode_domainModelGraphId_fkey" FOREIGN KEY ("domainModelGraphId") REFERENCES "domainModelGraph"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domainModelEdge" ADD CONSTRAINT "domainModelEdge_domainModelGraphId_fkey" FOREIGN KEY ("domainModelGraphId") REFERENCES "domainModelGraph"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domainModelEdge" ADD CONSTRAINT "domainModelEdge_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "domainModelNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domainModelEdge" ADD CONSTRAINT "domainModelEdge_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "domainModelNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningResource" ADD CONSTRAINT "LearningResource_domainModelNodeId_fkey" FOREIGN KEY ("domainModelNodeId") REFERENCES "domainModelNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
