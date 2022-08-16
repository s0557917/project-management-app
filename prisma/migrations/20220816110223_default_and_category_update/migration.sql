-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_categoryId_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "priority" SET DEFAULT 1,
ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "reminders" SET DEFAULT '{}';

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
