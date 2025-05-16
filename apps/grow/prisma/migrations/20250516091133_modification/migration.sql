-- DropForeignKey
ALTER TABLE "Certification" DROP CONSTRAINT "Certification_abilityId_fkey";

-- DropForeignKey
ALTER TABLE "Certification" DROP CONSTRAINT "Certification_certifierId_fkey";

-- DropForeignKey
ALTER TABLE "Certification" DROP CONSTRAINT "Certification_learnerId_fkey";

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_certifierId_fkey" FOREIGN KEY ("certifierId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "domainModelNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
