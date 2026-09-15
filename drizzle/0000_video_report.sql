CREATE TABLE `trip_videos` (
	`owner_id` text NOT NULL,
	`video_id` text NOT NULL,
	`title` text NOT NULL,
	`day_id` text,
	`created_at` text NOT NULL,
	PRIMARY KEY(`owner_id`, `video_id`)
);
