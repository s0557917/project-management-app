-- AlterTable
ALTER TABLE "users" ADD COLUMN     "defaultView" TEXT DEFAULT 'task-list',
ADD COLUMN     "filters" JSONB DEFAULT '[{"name": "Uncategorized","value": true},{"name": "Completed","value": false}]',
ADD COLUMN     "theme" TEXT DEFAULT 'dark';
