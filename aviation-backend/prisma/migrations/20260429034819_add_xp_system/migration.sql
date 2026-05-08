-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalXp" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "XpLog" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "XpLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "XpLog_userId_idx" ON "XpLog"("userId");

-- AddForeignKey
ALTER TABLE "XpLog" ADD CONSTRAINT "XpLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
