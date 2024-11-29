/*
  Warnings:

  - You are about to drop the `Mammals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Mammals`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `mammals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `species` VARCHAR(64) NOT NULL,
    `subclass` ENUM('placental', 'marsupial', 'monotreme') NOT NULL,
    `habitat` ENUM('terrestrial', 'aquatic', 'aerial') NOT NULL,
    `diet` ENUM('carnivore', 'herbivore', 'omnivore') NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `creator_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,
    `email` VARCHAR(512) NOT NULL,
    `passwd` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mammals` ADD CONSTRAINT `mammals_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
