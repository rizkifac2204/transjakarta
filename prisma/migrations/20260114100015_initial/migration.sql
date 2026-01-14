-- CreateTable
CREATE TABLE `level` (
    `id` INTEGER NOT NULL,
    `level` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
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

    UNIQUE INDEX `users_username_key`(`username`),
    INDEX `level_id`(`level_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `level`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;
