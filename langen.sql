DROP SCHEMA IF EXISTS langen; -- this will delete the database if it exists
                              -- look for way to implement this code only when
                              -- schema doesn't exist
CREATE SCHEMA langen;
USE langen;

CREATE USER IF NOT EXISTS 'u'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON langen.* TO 'u'@'localhost';
FLUSH PRIVILEGES;

SET GLOBAL time_zone = '+10:30';

CREATE TABLE user (
    email VARCHAR(320) NOT NULL,
    username VARCHAR(18) NOT NULL DEFAULT('') UNIQUE,
    -- might need to consider storing first name and last name
    password VARCHAR(128), -- hash and salt these
    role ENUM('user', 'admin') NOT NULL DEFAULT('user'),
    PRIMARY KEY (email)
);

CREATE TABLE user_session (
    session VARCHAR(500) NOT NULL,
    user_email VARCHAR(320) NOT NULL,
    expiry_date TIMESTAMP NOT NULL DEFAULT(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY)), -- will expire after a day (entries should not be returned if past expiry date)
    PRIMARY KEY (session),
    FOREIGN KEY (user_email) REFERENCES user(email) ON DELETE CASCADE
);

SET GLOBAL event_scheduler = ON;

-- automatic session deletion
CREATE EVENT delete_expired_sessions
ON SCHEDULE EVERY 1 HOUR
DO
DELETE FROM user_session WHERE expiry_date <= CURRENT_TIMESTAMP;


CREATE TABLE user_info (
    user_email VARCHAR(320) NOT NULL,
    firstname VARCHAR(18) DEFAULT(''),
    lastname VARCHAR(18) DEFAULT(''),
    contact VARCHAR(500) DEFAULT(''),
    biography VARCHAR(500) DEFAULT(''),
    profile_picture VARCHAR(500) DEFAULT('/images/users/profile/default.png'),
    PRIMARY KEY (user_email),
    FOREIGN KEY (user_email) REFERENCES user(email) ON DELETE CASCADE
);

-- Automatically Create User_Info Entry When New User
DELIMITER $$
CREATE TRIGGER ui_trigger AFTER INSERT ON user
FOR EACH ROW
BEGIN
  INSERT INTO user_info (user_email) VALUES (NEW.email);
END$$
DELIMITER ;

CREATE TABLE club (
    id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(2000) DEFAULT(''),
    picture VARCHAR(500) DEFAULT('/images/club/default.png'),
    category1 ENUM('Hobbies', 'Skills Development', 'Religion', 'Culture and Languages', 'Faculty') NOT NULL,
    status ENUM('pending', 'active', 'closed') NOT NULL DEFAULT('pending'),
    PRIMARY KEY (id)
);

-- get its club entry
-- SELECT club.id, club.name, club.description, club.picture, club.category1, member_count FROM (SELECT club.id, COUNT(club_member.club_id) AS member_count FROM club LEFT JOIN club_member ON club.id = club_member.club_id WHERE club.status = "active" GROUP BY club.id ORDER BY member_count DESC LIMIT 1) AS r INNER JOIN club WHERE r.id = club.id;

CREATE TABLE club_member (
    user_email VARCHAR(320) NOT NULL,
    club_id SMALLINT UNSIGNED NOT NULL,
    role ENUM('member', 'manager') NOT NULL DEFAULT('member'),
    receive_post_updates BOOLEAN DEFAULT(false),
    receive_event_updates BOOLEAN DEFAULT(false),
    PRIMARY KEY (user_email, club_id),
    FOREIGN KEY (user_email) REFERENCES user(email) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES club(id) ON DELETE CASCADE
);

CREATE TABLE post (
    id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_email VARCHAR(320) NOT NULL,
    club_id SMALLINT UNSIGNED NOT NULL,
    title VARCHAR(50) NOT NULL,
    content VARCHAR(500) DEFAULT(''),
    picture VARCHAR(500),
    visibility ENUM('public', 'private') NOT NULL DEFAULT('public'),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_email) REFERENCES user(email) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES club(id) ON DELETE CASCADE
);

CREATE TABLE event (
    id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    club_id SMALLINT UNSIGNED NOT NULL,
    title VARCHAR(50) NOT NULL,
    content VARCHAR(1000) DEFAULT(''),
    -- location POINT,
    location VARCHAR(200),
    event_time DATETIME,
    PRIMARY KEY (id),
    FOREIGN KEY (club_id) REFERENCES club(id) ON DELETE CASCADE
);

CREATE TABLE event_coordinator (
    user_email VARCHAR(320) NOT NULL,
    event_id SMALLINT UNSIGNED NOT NULL,
    manager_phone INT(11),
    PRIMARY KEY (user_email, event_id),
    FOREIGN KEY (user_email) REFERENCES user(email) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE
);

CREATE TABLE RSVP (
    user_email VARCHAR(320) NOT NULL,
    event_id SMALLINT UNSIGNED NOT NULL,
    PRIMARY KEY (user_email, event_id),
    FOREIGN KEY (user_email) REFERENCES user(email) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE
);

-- Create Test Data

-- (ADMIN) email: langen2023@gmail.com, password: !langen123
INSERT INTO user (email, username, password, role) VALUES ("langen2023@gmail.com", "langen", "$argon2id$v=19$m=65536,t=3,p=4$P8g1jHimsKpnZyp3n1mjpg$MpoJFn/Vc57Rz2EEEUNq26MatHYXDdCiqARZY+UgpC8", "admin");

-- email: 1@gmail.com, password: 1
-- INSERT INTO user (email, username, password) VALUES ("1@gmail.com", "test","$argon2id$v=19$m=65536,t=3,p=4$cMzMbM25kfp6Pnj0SiiU3w$lB7/gr8iL5SqiO48QJIUXU/jwqpl1SfXvY4LaeXvRvQ");

-- -- email: 2@gmail.com, password: 2
-- INSERT INTO user (email, username, password) VALUES ("2@gmail.com", "test2","$argon2id$v=19$m=65536,t=3,p=4$UMlyHhU5AEp6VZjAll+csw$O6b0+yQBAGeJPaPJ2/zDPyYwBPNOgJhgp1dVMkduSoA");

-- INSERT INTO `club` VALUES (1,'Test Club','Test Description','/images/club/default.png','Skills Development','pending'),(2,'Computer Science Club','Lorem Ipsum','/images/comp_sci_club.png','Faculty','active'),(3,'Adelaide Fashion Collective','Fashion Club','/images/club/club2.png','Hobbies','active'),(4,'Entrepreneurship Club','Club for entrepreneurs','/images/club/1685452912446-bezkoder-3435425_2_10534636_450639498409795_5040486039051317410_n.png','Skills Development','active'),(5,'Adelaide University Secular Club','Religious club','/images/club/1685452946981-bezkoder-Secular.png','Religion','active'),(6,'Adelaide Indian Students Society','Society for indian students','/images/club/1685453221336-bezkoder-3435333_2_Untitled-1.jpg','Culture and Languages','active');
-- INSERT INTO `event` VALUES (1,2,'Ex-Christmas','This is a previous event','IW 208','2021-12-25'),(2,2,'Christmas','This is an upcoming event','Uni Of Adelaide Hub Central','2023-12-25'),(3,2,'Test Event','This is an upcoming event','Barr Smith Lawns','2023-10-07');

-- INSERT INTO club (name) VALUES ("test");
-- INSERT INTO club_member (user_email, club_id, role) VALUES ("langen2023@gmail.com", 1, "manager");
-- INSERT INTO club_member (user_email, club_id, role) VALUES ("langen2023@gmail.com", 2, "member");