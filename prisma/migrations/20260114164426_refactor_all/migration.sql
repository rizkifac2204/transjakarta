/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `admin_ibfk_1`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level_id` INTEGER NOT NULL,
    `nama` VARCHAR(50) NULL,
    `telp` CHAR(15) NULL,
    `alamat` TEXT NULL,
    `email` VARCHAR(100) NULL,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(225) NOT NULL,
    `mfa_enabled` BOOLEAN NOT NULL DEFAULT false,
    `mfa_secret` VARCHAR(100) NULL,
    `valid` BOOLEAN NOT NULL DEFAULT false,
    `login` BOOLEAN NOT NULL DEFAULT false,
    `foto` TEXT NULL,
    `last_access` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL,
    `deleted_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    INDEX `level_id`(`level_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `service_type_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fleet_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `fleet_type_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `armada_question_set` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `armada_question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `set_id` INTEGER NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `spm_criteria` VARCHAR(191) NOT NULL,
    `spm_reference` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `armada_survey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `surveyor_id` INTEGER NOT NULL,
    `service_type_id` INTEGER NOT NULL,
    `fleet_type_id` INTEGER NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `periode` VARCHAR(191) NOT NULL,
    `jam_mulai` VARCHAR(191) NOT NULL,
    `jam_selesai` VARCHAR(191) NOT NULL,
    `no_body` VARCHAR(191) NOT NULL,
    `kode_trayek` VARCHAR(191) NOT NULL,
    `asal_tujuan` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `armada_survey_answer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `armada_survey_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `answer` BOOLEAN NOT NULL,
    `note` VARCHAR(191) NULL,
    `photo_url` VARCHAR(191) NULL,

    UNIQUE INDEX `armada_survey_answer_armada_survey_id_question_id_key`(`armada_survey_id`, `question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_armada_question_setToservice_type` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_armada_question_setToservice_type_AB_unique`(`A`, `B`),
    INDEX `_armada_question_setToservice_type_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_armada_question_setTofleet_type` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_armada_question_setTofleet_type_AB_unique`(`A`, `B`),
    INDEX `_armada_question_setTofleet_type_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `level`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `armada_question` ADD CONSTRAINT `armada_question_set_id_fkey` FOREIGN KEY (`set_id`) REFERENCES `armada_question_set`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `armada_survey` ADD CONSTRAINT `armada_survey_service_type_id_fkey` FOREIGN KEY (`service_type_id`) REFERENCES `service_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `armada_survey` ADD CONSTRAINT `armada_survey_fleet_type_id_fkey` FOREIGN KEY (`fleet_type_id`) REFERENCES `fleet_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `armada_survey` ADD CONSTRAINT `armada_survey_surveyor_id_fkey` FOREIGN KEY (`surveyor_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `armada_survey_answer` ADD CONSTRAINT `armada_survey_answer_armada_survey_id_fkey` FOREIGN KEY (`armada_survey_id`) REFERENCES `armada_survey`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `armada_survey_answer` ADD CONSTRAINT `armada_survey_answer_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `armada_question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_armada_question_setToservice_type` ADD CONSTRAINT `_armada_question_setToservice_type_A_fkey` FOREIGN KEY (`A`) REFERENCES `armada_question_set`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_armada_question_setToservice_type` ADD CONSTRAINT `_armada_question_setToservice_type_B_fkey` FOREIGN KEY (`B`) REFERENCES `service_type`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_armada_question_setTofleet_type` ADD CONSTRAINT `_armada_question_setTofleet_type_A_fkey` FOREIGN KEY (`A`) REFERENCES `armada_question_set`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_armada_question_setTofleet_type` ADD CONSTRAINT `_armada_question_setTofleet_type_B_fkey` FOREIGN KEY (`B`) REFERENCES `fleet_type`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
