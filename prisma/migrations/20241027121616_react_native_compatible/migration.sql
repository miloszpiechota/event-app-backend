/*
  Warnings:

  - You are about to alter the column `photo` on the `events` table. The data in that column could be lost. The data in that column will be cast from `Blob` to `VarChar(1024)`.
  - You are about to drop the column `payment_methods` on the `payments` table. All the data in the column will be lost.
  - Added the required column `is_seat_categorized` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idpayment_method` to the `Payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comments` MODIFY `date_comment` DATETIME(0) NOT NULL;

-- AlterTable
ALTER TABLE `events` ADD COLUMN `is_seat_categorized` BOOLEAN NOT NULL,
    MODIFY `photo` VARCHAR(1024) NULL;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `payment_methods`,
    ADD COLUMN `idpayment_method` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `payment_methods` (
    `idpayment_method` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`idpayment_method`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payments` ADD CONSTRAINT `Payments_idpayment_method_fkey` FOREIGN KEY (`idpayment_method`) REFERENCES `payment_methods`(`idpayment_method`) ON DELETE RESTRICT ON UPDATE CASCADE;
