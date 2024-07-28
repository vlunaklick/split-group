/*
  Warnings:

  - You are about to drop the `Involved` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Involved" DROP CONSTRAINT "Involved_creditorId_fkey";

-- DropForeignKey
ALTER TABLE "Involved" DROP CONSTRAINT "Involved_involvedId_fkey";

-- DropForeignKey
ALTER TABLE "Involved" DROP CONSTRAINT "Involved_spendingId_fkey";

-- DropForeignKey
ALTER TABLE "Payers" DROP CONSTRAINT "Payers_payerId_fkey";

-- DropForeignKey
ALTER TABLE "Payers" DROP CONSTRAINT "Payers_spendingId_fkey";

-- DropTable
DROP TABLE "Involved";

-- DropTable
DROP TABLE "Payers";

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payerId" TEXT NOT NULL,
    "spendingId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Debt" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "debterId" TEXT NOT NULL,
    "spendingId" TEXT NOT NULL,
    "creditorId" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL,
    "forgiven" BOOLEAN NOT NULL,

    CONSTRAINT "Debt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_spendingId_fkey" FOREIGN KEY ("spendingId") REFERENCES "Spending"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_debterId_fkey" FOREIGN KEY ("debterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_spendingId_fkey" FOREIGN KEY ("spendingId") REFERENCES "Spending"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debt" ADD CONSTRAINT "Debt_creditorId_fkey" FOREIGN KEY ("creditorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
