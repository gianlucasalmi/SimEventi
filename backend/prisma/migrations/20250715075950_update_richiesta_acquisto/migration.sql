/*
  Warnings:

  - You are about to drop the `Evento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Iscrizione` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Iscrizione" DROP CONSTRAINT "Iscrizione_EventoID_fkey";

-- DropForeignKey
ALTER TABLE "Iscrizione" DROP CONSTRAINT "Iscrizione_UtenteID_fkey";

-- DropTable
DROP TABLE "Evento";

-- DropTable
DROP TABLE "Iscrizione";

-- CreateTable
CREATE TABLE "CategoriaAcquisto" (
    "CategoriaID" SERIAL NOT NULL,
    "Descrizione" TEXT NOT NULL,

    CONSTRAINT "CategoriaAcquisto_pkey" PRIMARY KEY ("CategoriaID")
);

-- CreateTable
CREATE TABLE "RichiestaAcquisto" (
    "RichiestaID" SERIAL NOT NULL,
    "DataRichiesta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CategoriaID" INTEGER NOT NULL,
    "Oggetto" TEXT NOT NULL,
    "Quantità" INTEGER NOT NULL,
    "CostoUnitario" DOUBLE PRECISION NOT NULL,
    "Motivazione" TEXT NOT NULL,
    "Stato" TEXT NOT NULL,
    "UtenteID" INTEGER NOT NULL,

    CONSTRAINT "RichiestaAcquisto_pkey" PRIMARY KEY ("RichiestaID")
);

-- AddForeignKey
ALTER TABLE "RichiestaAcquisto" ADD CONSTRAINT "RichiestaAcquisto_UtenteID_fkey" FOREIGN KEY ("UtenteID") REFERENCES "Utente"("UtenteID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RichiestaAcquisto" ADD CONSTRAINT "RichiestaAcquisto_CategoriaID_fkey" FOREIGN KEY ("CategoriaID") REFERENCES "CategoriaAcquisto"("CategoriaID") ON DELETE RESTRICT ON UPDATE CASCADE;
