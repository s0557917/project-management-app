-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "dueDate" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "start" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "end" SET DATA TYPE TIMESTAMPTZ(3);
