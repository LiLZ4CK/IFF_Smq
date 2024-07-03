-- CreateTable
CREATE TABLE "fichier" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "redacteur" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "typeDoc" TEXT NOT NULL,
    "processus" TEXT NOT NULL,
    "natureDoc" TEXT,
    "produit" TEXT,
    "service" TEXT,
    "compleme" TEXT,
    "commentaire" TEXT,

    CONSTRAINT "fichier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fichier_id_key" ON "fichier"("id");
