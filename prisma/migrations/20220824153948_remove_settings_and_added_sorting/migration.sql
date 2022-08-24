/*
  Warnings:

  - You are about to drop the column `settings` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "settings",
ADD COLUMN     "sorting" TEXT DEFAULT 'priority';
