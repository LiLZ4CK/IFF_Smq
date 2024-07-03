/*
  Warnings:

  - You are about to drop the `Noc` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Nconform" ALTER COLUMN "responsables" SET DATA TYPE TEXT[],
ALTER COLUMN "processus" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Noc";
