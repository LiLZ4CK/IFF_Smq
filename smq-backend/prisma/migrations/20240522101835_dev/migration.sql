/*
  Warnings:

  - Added the required column `processusname` to the `Risque` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Risque" ADD COLUMN     "processusname" TEXT NOT NULL;
