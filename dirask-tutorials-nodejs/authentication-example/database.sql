CREATE DATABASE `demo_db`;

CREATE TABLE `users` (
	`id` BIGINT(20) NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(255) NOT NULL,
	`password` VARCHAR(255) NOT NULL,
	`email` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `UK_username` (`username`) USING BTREE,
	UNIQUE INDEX `UK_email` (`email`) USING BTREE
);