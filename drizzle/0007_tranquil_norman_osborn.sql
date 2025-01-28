CREATE TABLE `email_verification` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`code` char(10),
	`expires_at` datetime NOT NULL,
	CONSTRAINT `email_verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `email_verified` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `email_verification` ADD CONSTRAINT `email_verification_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;