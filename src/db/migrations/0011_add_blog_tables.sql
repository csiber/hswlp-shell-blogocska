CREATE TABLE `posts` (
    `id` text PRIMARY KEY NOT NULL,
    `user_id` text NOT NULL,
    `title` text,
    `content` text,
    `category` text,
    `status` text DEFAULT 'pending' NOT NULL,
    `image_url` text,
    `created_at` integer NOT NULL,
    `updated_at` integer NOT NULL
);
CREATE INDEX `posts_user_id_idx` ON `posts` (`user_id`);

CREATE TABLE `post_read` (
    `id` text PRIMARY KEY NOT NULL,
    `post_id` text NOT NULL,
    `user_id` text NOT NULL,
    `ip_hash` text NOT NULL,
    `duration_sec` integer NOT NULL,
    `created_at` integer NOT NULL
);
CREATE INDEX `post_read_post_id_idx` ON `post_read` (`post_id`);
CREATE INDEX `post_read_user_id_idx` ON `post_read` (`user_id`);

CREATE TABLE `post_tag` (
    `id` text PRIMARY KEY NOT NULL,
    `source_post_id` text NOT NULL,
    `target_post_id` text NOT NULL
);
CREATE INDEX `post_tag_source_idx` ON `post_tag` (`source_post_id`);
CREATE INDEX `post_tag_target_idx` ON `post_tag` (`target_post_id`);

CREATE TABLE `moderation_log` (
    `id` text PRIMARY KEY NOT NULL,
    `post_id` text NOT NULL,
    `moderator_id` text NOT NULL,
    `action` text NOT NULL,
    `note` text,
    `created_at` integer NOT NULL
);
CREATE INDEX `moderation_log_post_id_idx` ON `moderation_log` (`post_id`);

CREATE TABLE `post_category` (
    `id` text PRIMARY KEY NOT NULL,
    `slug` text NOT NULL,
    `name` text NOT NULL
);
CREATE UNIQUE INDEX `post_category_slug_unique` ON `post_category` (`slug`);
