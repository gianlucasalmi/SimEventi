/*
  Warnings:

  - You are about to drop the column `CategoriaID` on the `RichiestaAcquisto` table. All the data in the column will be lost.
  - You are about to drop the `CategoriaAcquisto` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Categoria` to the `RichiestaAcquisto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RichiestaAcquisto" DROP CONSTRAINT "RichiestaAcquisto_CategoriaID_fkey";

-- AlterTable
ALTER TABLE "RichiestaAcquisto" DROP COLUMN "CategoriaID",
ADD COLUMN     "Categoria" TEXT NOT NULL;

-- DropTable
DROP TABLE "CategoriaAcquisto";
