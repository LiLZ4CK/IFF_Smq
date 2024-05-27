-- CreateTable
CREATE TABLE "Processus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "responsableId" INTEGER NOT NULL,
    "element" TEXT NOT NULL,
    "pilot" TEXT NOT NULL,
    "finalite" TEXT NOT NULL,
    "indicateurEobject" TEXT NOT NULL,

    CONSTRAINT "Processus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Risque" (
    "id" SERIAL NOT NULL,
    "processusId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "consequence" TEXT NOT NULL,
    "maitrise" TEXT NOT NULL,

    CONSTRAINT "Risque_pkey" PRIMARY KEY ("id")
);
