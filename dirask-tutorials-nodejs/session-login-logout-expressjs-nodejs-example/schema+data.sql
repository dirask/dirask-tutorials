
CREATE DATABASE IF NOT EXISTS `my_database`;
USE `my_database`;

-- database schema

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- example data

INSERT INTO `users`
  (`id`, `username`, `password`)
VALUES
	(1, 'admin', 'admin');