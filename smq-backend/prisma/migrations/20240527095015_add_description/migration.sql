/*
  Warnings:

  - A unique constraint covering the columns `[PdescriptionId]` on the table `Processus` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Processus" ADD COLUMN     "PdescriptionId" INTEGER;

-- CreateTable
CREATE TABLE "Pdescription" (
    "id" SERIAL NOT NULL,
    "processusId" INTEGER NOT NULL,
    "msurvielle" TEXT[],
    "mhumains" TEXT[],
    "dentree" TEXT[],
    "aprocessus" TEXT[],
    "dsortie" TEXT[],
    "responsable" TEXT[],
    "iobjectifs" TEXT[],
    "dassocies" TEXT[],

    CONSTRAINT "Pdescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pdescription_processusId_key" ON "Pdescription"("processusId");

-- CreateIndex
CREATE UNIQUE INDEX "Processus_PdescriptionId_key" ON "Processus"("PdescriptionId");
