-- CreateTable
CREATE TABLE "Noc" (
    "id" SERIAL NOT NULL,
    "processusId" INTEGER NOT NULL,
    "constat" TEXT NOT NULL,
    "origine" TEXT NOT NULL,
    "constatdate" TIMESTAMP(3) NOT NULL,
    "actionImm" TEXT NOT NULL,
    "actionCor" TEXT NOT NULL,

    CONSTRAINT "Noc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nconform" (
    "id" SERIAL NOT NULL,
    "responsables" INTEGER[],
    "processus" INTEGER NOT NULL,
    "constats" TEXT NOT NULL,
    "origine" TEXT NOT NULL,
    "constatdate" TIMESTAMP(3) NOT NULL,
    "acorrective" TEXT NOT NULL,
    "refqualite" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "aimmediates" TEXT[],

    CONSTRAINT "Nconform_pkey" PRIMARY KEY ("id")
);
