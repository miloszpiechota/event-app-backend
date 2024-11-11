/*
  Warnings:

  - You are about to drop the column `status` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `events` DROP COLUMN `status`,
    ADD COLUMN `idstatus_type` INTEGER NULL;

-- CreateTable
CREATE TABLE `Status_type` (
    `idstatus_type` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`idstatus_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Events` ADD CONSTRAINT `Events_idstatus_type_fkey` FOREIGN KEY (`idstatus_type`) REFERENCES `Status_type`(`idstatus_type`) ON DELETE SET NULL ON UPDATE CASCADE;
