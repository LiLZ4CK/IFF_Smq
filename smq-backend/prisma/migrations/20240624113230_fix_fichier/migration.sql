/*
  Warnings:

  - Added the required column `group` to the `fichier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fichier" ADD COLUMN     "group" TEXT NOT NULL;
