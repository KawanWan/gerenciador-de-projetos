-- CreateTable
CREATE TABLE `_UserProjects` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserProjects_AB_unique`(`A`, `B`),
    INDEX `_UserProjects_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserProjects` ADD CONSTRAINT `_UserProjects_A_fkey` FOREIGN KEY (`A`) REFERENCES `Projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserProjects` ADD CONSTRAINT `_UserProjects_B_fkey` FOREIGN KEY (`B`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
