-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'E_WALLET', 'CREDIT_CARD', 'RETAIL', 'PAYLATER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SETTLEMENT', 'CAPTURE', 'DENY', 'CANCEL', 'EXPIRE', 'FAILURE', 'REFUND', 'PARTIAL_REFUND', 'CHARGEBACK', 'PARTIAL_CHARGEBACK', 'AUTHORIZE');

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'midtrans',
    "transactionId" TEXT,
    "transactionTime" TIMESTAMP(3),
    "transactionStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentType" TEXT,
    "vaNumber" TEXT,
    "bank" TEXT,
    "expiryTime" TIMESTAMP(3),
    "paymentLink" TEXT,
    "responseTime" TIMESTAMP(3),
    "responseData" JSONB,
    "settlement" JSONB,
    "statusHistory" JSONB,
    "failureReason" TEXT,
    "refundAmount" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_orderId_key" ON "payments"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
