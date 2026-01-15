-- DropForeignKey
ALTER TABLE `armada_question` DROP FOREIGN KEY `armada_question_set_id_fkey`;

-- DropIndex
DROP INDEX `armada_question_set_id_fkey` ON `armada_question`;

-- AddForeignKey
ALTER TABLE `armada_question` ADD CONSTRAINT `armada_question_set_id_fkey` FOREIGN KEY (`set_id`) REFERENCES `armada_question_set`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
