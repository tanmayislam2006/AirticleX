-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parentID_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_postID_fkey";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postID_fkey" FOREIGN KEY ("postID") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentID_fkey" FOREIGN KEY ("parentID") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
