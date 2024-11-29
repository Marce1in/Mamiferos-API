/*
  Warnings:

  - Added the required column `userId` to the `mammals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mammals` ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `mammals` ADD CONSTRAINT `mammals_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
