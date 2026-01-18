-- AlterTable
ALTER TABLE `armada_question` ALTER COLUMN `order` DROP DEFAULT;

-- AlterTable
ALTER TABLE `armada_survey` ALTER COLUMN `jam_selesai` DROP DEFAULT;

-- CreateTable
CREATE TABLE `shelter_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `shelter_type_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shelter_question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shelter_type_id` INTEGER NULL,
    `section` ENUM('KEAMANAN', 'KESELAMATAN', 'KENYAMANAN', 'KETERJANGKAUAN', 'KESETARAAN', 'KETERATURAN') NOT NULL,
    `basic` TEXT NULL,
    `indicator` TEXT NULL,
    `spm_criteria` TEXT NOT NULL,
    `spm_reference` VARCHAR(191) NULL,
    `order` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shelter_survey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `surveyor_id` INTEGER NOT NULL,
    `shelter_type_id` INTEGER NOT NULL,
    `nama_halte` VARCHAR(191) NOT NULL,
    `kode_halte` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `periode` VARCHAR(191) NOT NULL,
    `jam_mulai` DATETIME(3) NOT NULL,
    `jam_selesai` DATETIME(3) NOT NULL,
    `finish` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shelter_survey_answer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shelter_survey_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `answer` BOOLEAN NOT NULL,
    `note` VARCHAR(191) NULL,
    `photo_url` VARCHAR(191) NULL,

    UNIQUE INDEX `shelter_survey_answer_shelter_survey_id_question_id_key`(`shelter_survey_id`, `question_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `shelter_question` ADD CONSTRAINT `shelter_question_shelter_type_id_fkey` FOREIGN KEY (`shelter_type_id`) REFERENCES `shelter_type`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shelter_survey` ADD CONSTRAINT `shelter_survey_surveyor_id_fkey` FOREIGN KEY (`surveyor_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shelter_survey` ADD CONSTRAINT `shelter_survey_shelter_type_id_fkey` FOREIGN KEY (`shelter_type_id`) REFERENCES `shelter_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shelter_survey_answer` ADD CONSTRAINT `shelter_survey_answer_shelter_survey_id_fkey` FOREIGN KEY (`shelter_survey_id`) REFERENCES `shelter_survey`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shelter_survey_answer` ADD CONSTRAINT `shelter_survey_answer_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `shelter_question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
