ALTER TABLE `email_verification` MODIFY COLUMN `userId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `email_verification` MODIFY COLUMN `code` char(10) NOT NULL;