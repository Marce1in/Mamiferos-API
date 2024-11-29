/*
  Warnings:

  - You are about to drop the column `creator_id` on the `mammals` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `mammals` DROP FOREIGN KEY `mammals_creator_id_fkey`;

-- AlterTable
ALTER TABLE `mammals` DROP COLUMN `creator_id`;
