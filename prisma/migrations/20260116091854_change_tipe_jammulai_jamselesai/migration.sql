/*
  Warnings:

  - You are about to alter the column `jam_mulai` on the `armada_survey` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Timestamp(0)`.
  - You are about to alter the column `jam_selesai` on the `armada_survey` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Timestamp(0)`.

*/
-- AlterTable
ALTER TABLE `armada_survey` MODIFY `jam_mulai` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `jam_selesai` TIMESTAMP(0) NOT NULL;
