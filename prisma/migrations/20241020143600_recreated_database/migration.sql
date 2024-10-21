-- CreateTable
CREATE TABLE `Cities` (
    `idcity` INTEGER NOT NULL AUTO_INCREMENT,
    `city` VARCHAR(100) NOT NULL,
    `idcountry` INTEGER NOT NULL,

    PRIMARY KEY (`idcity`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Countries` (
    `idcountry` INTEGER NOT NULL AUTO_INCREMENT,
    `name_country` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idcountry`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comments` (
    `idcomment` INTEGER NOT NULL AUTO_INCREMENT,
    `idevent` INTEGER NOT NULL,
    `iduser` INTEGER NOT NULL,
    `comment` VARCHAR(512) NOT NULL,
    `date_comment` DATE NOT NULL,

    PRIMARY KEY (`idcomment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Events` (
    `idevent` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `start_date` DATETIME(0) NOT NULL,
    `end_date` DATETIME(0) NULL,
    `description` VARCHAR(1024) NULL,
    `number_of_ticket` INTEGER NOT NULL,
    `photo` BLOB NULL,
    `contact_info` VARCHAR(256) NOT NULL,
    `idevent_category` INTEGER NOT NULL,
    `idevent_location` INTEGER NOT NULL,
    `status` TINYINT NOT NULL,

    PRIMARY KEY (`idevent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event_categories` (
    `idevent_category` INTEGER NOT NULL AUTO_INCREMENT,
    `category_type` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idevent_category`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event_locations` (
    `idevent_location` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `idcity` INTEGER NOT NULL,

    PRIMARY KEY (`idevent_location`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event_tickets` (
    `idevent_ticket` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `price` FLOAT NOT NULL,
    `start_date` DATETIME(0) NOT NULL,
    `end_date` DATETIME(0) NOT NULL,
    `idevent` INTEGER NOT NULL,

    PRIMARY KEY (`idevent_ticket`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Favourite_events` (
    `idfavourite_event` INTEGER NOT NULL AUTO_INCREMENT,
    `idevent` INTEGER NOT NULL,
    `iduser` INTEGER NOT NULL,

    PRIMARY KEY (`idfavourite_event`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orders` (
    `idorder` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATE NOT NULL,
    `total_amount` FLOAT NOT NULL,
    `total_tax_amount` FLOAT NOT NULL,
    `iduser` INTEGER NOT NULL,

    PRIMARY KEY (`idorder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order_tickets` (
    `idorder_ticket` INTEGER NOT NULL AUTO_INCREMENT,
    `idevent_ticket` INTEGER NOT NULL,
    `idorder` INTEGER NOT NULL,
    `ticket_status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idorder_ticket`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payments` (
    `idpayment` INTEGER NOT NULL AUTO_INCREMENT,
    `idorder` INTEGER NOT NULL,
    `payment_methods` VARCHAR(191) NOT NULL,
    `payment_status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idpayment`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `iduser` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `second_name` VARCHAR(45) NULL,
    `surname` VARCHAR(45) NOT NULL,
    `iduser_type` INTEGER NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `phonenumber` INTEGER NOT NULL,
    `zipcode` VARCHAR(45) NOT NULL,
    `street` VARCHAR(100) NOT NULL,
    `idcity` INTEGER NOT NULL,
    `password` VARCHAR(256) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`iduser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_types` (
    `iduser_type` INTEGER NOT NULL,
    `name_type` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`iduser_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cities` ADD CONSTRAINT `Cities_idcountry_fkey` FOREIGN KEY (`idcountry`) REFERENCES `Countries`(`idcountry`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_idevent_fkey` FOREIGN KEY (`idevent`) REFERENCES `Events`(`idevent`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_iduser_fkey` FOREIGN KEY (`iduser`) REFERENCES `Users`(`iduser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Events` ADD CONSTRAINT `Events_idevent_category_fkey` FOREIGN KEY (`idevent_category`) REFERENCES `Event_categories`(`idevent_category`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Events` ADD CONSTRAINT `Events_idevent_location_fkey` FOREIGN KEY (`idevent_location`) REFERENCES `Event_locations`(`idevent_location`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_locations` ADD CONSTRAINT `Event_locations_idcity_fkey` FOREIGN KEY (`idcity`) REFERENCES `Cities`(`idcity`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_tickets` ADD CONSTRAINT `Event_tickets_idevent_fkey` FOREIGN KEY (`idevent`) REFERENCES `Events`(`idevent`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favourite_events` ADD CONSTRAINT `Favourite_events_idevent_fkey` FOREIGN KEY (`idevent`) REFERENCES `Events`(`idevent`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favourite_events` ADD CONSTRAINT `Favourite_events_iduser_fkey` FOREIGN KEY (`iduser`) REFERENCES `Users`(`iduser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_iduser_fkey` FOREIGN KEY (`iduser`) REFERENCES `Users`(`iduser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order_tickets` ADD CONSTRAINT `Order_tickets_idevent_ticket_fkey` FOREIGN KEY (`idevent_ticket`) REFERENCES `Event_tickets`(`idevent_ticket`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order_tickets` ADD CONSTRAINT `Order_tickets_idorder_fkey` FOREIGN KEY (`idorder`) REFERENCES `Orders`(`idorder`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payments` ADD CONSTRAINT `Payments_idorder_fkey` FOREIGN KEY (`idorder`) REFERENCES `Orders`(`idorder`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_iduser_type_fkey` FOREIGN KEY (`iduser_type`) REFERENCES `User_types`(`iduser_type`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_idcity_fkey` FOREIGN KEY (`idcity`) REFERENCES `Cities`(`idcity`) ON DELETE RESTRICT ON UPDATE CASCADE;
