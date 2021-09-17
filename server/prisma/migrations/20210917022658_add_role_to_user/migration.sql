-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'TEACHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT E'TEACHER';
