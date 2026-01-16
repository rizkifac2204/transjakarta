/*
  Warnings:

  - You are about to drop the column `category` on the `armada_question` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `armada_question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `armada_question` DROP COLUMN `category`,
    DROP COLUMN `text`,
    ADD COLUMN `basic` VARCHAR(191) NULL,
    ADD COLUMN `indicator` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `armada_survey` ADD COLUMN `finish` BOOLEAN NOT NULL DEFAULT false;
