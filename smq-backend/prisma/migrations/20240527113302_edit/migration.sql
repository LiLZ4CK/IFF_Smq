/*
  Warnings:

  - You are about to drop the column `PdescriptionId` on the `Processus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pdescriptionId]` on the table `Processus` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Processus_PdescriptionId_key";

-- AlterTable
ALTER TABLE "Processus" DROP COLUMN "PdescriptionId",
ADD COLUMN     "pdescriptionId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Processus_pdescriptionId_key" ON "Processus"("pdescriptionId");
