/*
  Warnings:

  - You are about to drop the `users_detail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `full_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_photo_path` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users_detail" DROP CONSTRAINT "users_detail_user_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "description" TEXT,
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "profile_photo_path" TEXT NOT NULL,
ADD COLUMN     "skills" TEXT,
ADD COLUMN     "work_history" TEXT;

-- DropTable
DROP TABLE "users_detail";
