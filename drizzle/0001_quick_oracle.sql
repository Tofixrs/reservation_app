ALTER TABLE `sessions` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `sessions` MODIFY COLUMN `id` varchar(255) NOT NULL;