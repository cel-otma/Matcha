CREATE DATABASE IF NOT EXISTS `matcha`;

use `matcha`;

CREATE TABLE IF NOT EXISTS `users` (
    `user_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `first_name` VARCHAR(20) NOT NULL,
    `last_name` VARCHAR(20) NOT NULL,
    `login` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100 ) NOT NULL,
    `passwd` VARCHAR(200) NOT NULL,
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `history` (
    `history_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `user_id` int NOT NULL,
    `message` varchar(100) NOT NULL,
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `gps_position` (
    `gps_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `user_id` INT NOT NULL,
    `latitude` VARCHAR(20) NOT NULL,
    `longitude` VARCHAR(20) NOT NULL,
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `inboxs` (
    `inbox_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `user_id` int NOT NULL,
    `to_id` int NOT NULL,
    `message` TEXT(65535) NOT NULL,
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`to_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `reports` (
    `rep_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `user_id` int NOT NULL,
    `to_id` int NOT NULL,
    `report_type` ENUM('FAKEACCOUNT') NOT NULL,
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`to_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `blocks` (
    `blocks_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `user_id` int NOT NULL,
    `to_id` int NOT NULL,
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`to_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `Notifications` (
    `nts_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `nts_vue` ENUM('1', '2') DEFAULT 1,
    `user_id` int NOT NULL,
    `from_id` int NOT NULL,
    `message` varchar(100) NOT NULL,
    `nts_type` ENUM("Visit", "follow", "unfollow", "rating", "message") NOT NULL,
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`from_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS `followers` (
    `from_uid` int NOT NULL,
    `to_uid` int NOT NULL,
    `follow_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL, 
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`from_uid`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`to_uid`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS `rating` (
    `from_uid` int NOT NULL,
    `to_uid` int NOT NULL,
    `rat_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `rat_nbr` int NOT NULL,
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`from_uid`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`to_uid`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `users_infos` (
    `info_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `user_id` INT NOT NULL,
    `city` VARCHAR(200) NOT NULL,
    `desc` VARCHAR(500) NOT NULL,
    `birthday` VARCHAR(12) NOT NULL,
    `gendre` ENUM('female', 'male') NOT NULL,
    `sex_pref` ENUM('female', 'male', 'both') NOT NULL,
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `status` (
    `status_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `user_id` INT NOT NULL,
    `status` ENUM('online', 'offline') NOT NULL,
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS `users_imgs` (
    `user_id` int NOT NULL,
    `img_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `image_path` VARCHAR (50) NOT NULL, 
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `alltags` (
    `tags_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `tag` VARCHAR(50) NOT NULL,
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `users_tags` (
    `utags_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `user_id` int NOT NULL,
    `state` ENUM('active', 'inactive') NOT NULL,
    `tags_id` int NOT NULL,
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`tags_id`) REFERENCES alltags(`tags_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `confirm` (
    `user_id` int NOT NULL,
    `con_id` int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `con_key` VARCHAR(10) NOT NULL,
    `con_type` ENUM('Account', 'Email', 'ResetPasswd') NOT NULL,
    `created_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `modified_dat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TRIGGER `nts_inbox_insert` AFTER INSERT  on `inboxs`
FOR EACH ROW INSERT INTO `Notifications` (`user_id`, `from_id`, `message`, `nts_type`)
VALUES (new.`to_id`, new.`user_id`, 'You get new message from <login>', 'message');

CREATE TRIGGER `nts_follows_insert` AFTER INSERT on `followers`
FOR EACH ROW INSERT INTO `Notifications` (`user_id`, `from_id`, `message`, `nts_type`)
VALUES (new.`to_uid`, new.`from_uid`,'You get new Follow from <login>', 'follow');


CREATE TRIGGER `nts_follows_delete` BEFORE DELETE on `followers`
FOR EACH ROW INSERT INTO `Notifications` (`user_id`, `from_id`, `message`, `nts_type`)
VALUES (OLD.`to_uid`, OLD.`from_uid`, 'You get unfollow from <login>', 'unfollow');

CREATE TRIGGER `nts_rating_insert` AFTER INSERT on `rating`
FOR EACH ROW INSERT INTO `Notifications` (`user_id`, `from_id`, `message`, `nts_type`)
VALUES (new.`to_uid`, new.`from_uid`,'<login> are rated you', 4);
