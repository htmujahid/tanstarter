ALTER TABLE `notes` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
CREATE INDEX `notes_userId_idx` ON `notes` (`user_id`);