-- AlterTable
ALTER TABLE "Audit" ALTER COLUMN "lieu" SET DEFAULT 'IFF';

-- CreateTable
CREATE TABLE "Indicateur" (
    "id" SERIAL NOT NULL,
    "processus" INTEGER NOT NULL,
    "responsableId" INTEGER NOT NULL,
    "frequence" TEXT NOT NULL,
    "axePoli" INTEGER NOT NULL,
    "formul" TEXT,
    "objectif" TEXT,
    "seuil" TEXT,
    "result" TEXT,
    "object" TEXT,

    CONSTRAINT "Indicateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constat" (
    "id" SERIAL NOT NULL,
    "processus" TEXT NOT NULL,
    "typeConstat" TEXT NOT NULL,
    "origine" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "constat" TEXT NOT NULL,
    "analyse" TEXT,
    "typeAction" TEXT,
    "action" TEXT,
    "responsableId" INTEGER NOT NULL,
    "delaiTrait" TIMESTAMP(3) NOT NULL,
    "suivi" TEXT,
    "actionEfficace" TEXT,
    "criteresDeval" TEXT,
    "dateEvaluation" TEXT,
    "observation" TEXT,

    CONSTRAINT "constat_pkey" PRIMARY KEY ("id")
);
