-- CreateTable
CREATE TABLE `Mammals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `species` VARCHAR(64) NOT NULL,
    `subclass` ENUM('placental', 'marsupial', 'monotreme') NOT NULL,
    `habitat` ENUM('terrestrial', 'aquatic', 'aerial') NOT NULL,
    `diet` ENUM('carnivore', 'herbivore', 'omnivore') NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,
    `email` VARCHAR(512) NOT NULL,
    `passwd` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
