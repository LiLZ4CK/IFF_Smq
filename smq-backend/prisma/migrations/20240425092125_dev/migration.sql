-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('CONSULT', 'EDIT', 'DOWNLOAD');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER,
    "isvirified" BOOLEAN NOT NULL DEFAULT false,
    "VerificationCode" TEXT NOT NULL DEFAULT '0',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "permissions" "Permission"[],

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audit" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "responsableId" INTEGER NOT NULL,
    "processus" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lieu" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "path" TEXT,
    "constat" TEXT,
    "constatType" TEXT,
    "planningDate" TIMESTAMP(3),
    "realisationDate" TIMESTAMP(3),

    CONSTRAINT "Audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "responsableId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "priorite" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "echeance" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "cout" INTEGER NOT NULL,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
