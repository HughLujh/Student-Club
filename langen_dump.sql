-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: langen
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `langen`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `langen` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `langen`;

-- create username and passowrd
CREATE USER IF NOT EXISTS 'u'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON langen.* TO 'u'@'localhost';
FLUSH PRIVILEGES;

--
-- Table structure for table `RSVP`
--

DROP TABLE IF EXISTS `RSVP`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RSVP` (
  `user_email` varchar(320) NOT NULL,
  `event_id` smallint unsigned NOT NULL,
  PRIMARY KEY (`user_email`,`event_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `RSVP_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `user` (`email`) ON DELETE CASCADE,
  CONSTRAINT `RSVP_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RSVP`
--

LOCK TABLES `RSVP` WRITE;
/*!40000 ALTER TABLE `RSVP` DISABLE KEYS */;
INSERT INTO `RSVP` VALUES ('2U@langen2023.com',1),('4U@langen2023.com',1),('6U@langen2023.com',1),('4U@langen2023.com',3),('1U@langen2023.com',7),('4U@langen2023.com',7),('7U@langen2023.com',7),('4U@langen2023.com',8),('6U@langen2023.com',8),('4U@langen2023.com',9),('7U@langen2023.com',9),('4U@langen2023.com',10),('6U@langen2023.com',10),('1U@langen2023.com',11),('4U@langen2023.com',11),('2U@langen2023.com',13),('4U@langen2023.com',13),('6U@langen2023.com',13),('1U@langen2023.com',14),('4U@langen2023.com',14),('6U@langen2023.com',14),('4U@langen2023.com',15),('6U@langen2023.com',15),('2U@langen2023.com',16),('4U@langen2023.com',16),('11U@langen2023.com',17),('14U@langen2023.com',17),('15U@langen2023.com',17),('8U@langen2023.com',17),('10U@langen2023.com',19),('11U@langen2023.com',19),('8U@langen2023.com',19),('10U@langen2023.com',22),('11U@langen2023.com',22),('12U@langen2023.com',22),('13U@langen2023.com',22),('14U@langen2023.com',22),('15U@langen2023.com',22),('8U@langen2023.com',22),('9U@langen2023.com',22),('11U@langen2023.com',23),('15U@langen2023.com',23),('9U@langen2023.com',23),('10U@langen2023.com',24),('12U@langen2023.com',24),('9U@langen2023.com',24),('11U@langen2023.com',25),('9U@langen2023.com',25),('11U@langen2023.com',29),('12U@langen2023.com',29),('14U@langen2023.com',29),('10U@langen2023.com',30),('11U@langen2023.com',30),('12U@langen2023.com',30),('14U@langen2023.com',30),('15U@langen2023.com',30),('10U@langen2023.com',31),('15U@langen2023.com',31),('11U@langen2023.com',35),('15U@langen2023.com',35),('11U@langen2023.com',36),('14U@langen2023.com',36),('15U@langen2023.com',36),('10U@langen2023.com',37),('11U@langen2023.com',37),('14U@langen2023.com',37),('15U@langen2023.com',37),('8U@langen2023.com',37);
/*!40000 ALTER TABLE `RSVP` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club`
--

DROP TABLE IF EXISTS `club`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(2000) DEFAULT (_utf8mb4''),
  `picture` varchar(500) DEFAULT (_utf8mb4'/images/club/default.png'),
  `category1` enum('Hobbies','Skills Development','Religion','Culture and Languages','Faculty') NOT NULL,
  `status` enum('pending','active','closed') NOT NULL DEFAULT (_utf8mb4'pending'),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club`
--

LOCK TABLES `club` WRITE;
/*!40000 ALTER TABLE `club` DISABLE KEYS */;
INSERT INTO `club` VALUES (1,'Adelaide Christian Club','An Adelaide based Christian club open to all following the faith of Christianity, or simply trying to learn more about it.','/images/club/1686201095034-bezkoder-acc.jpg','Religion','active'),(2,'Philosophy and Religion','The Adelaide Philosophy and Religion Faculty club.','/images/club/1686201499125-bezkoder-yin and yang.png','Faculty','active'),(3,'Sciences, Engineering and Technology','Faculty of Sciences, Engineering and Technology','/images/club/1686207488159-bezkoder-set.jpg','Faculty','active'),(4,'English Club','Literary and English Literature Analysis','/images/club/1686209270682-bezkoder-english club.jpg','Culture and Languages','active'),(5,'Cow Religion','Worship the blessed cow :)','/images/club/1686210261269-bezkoder-pngwing.com.png','Religion','active'),(6,'MOOO','Learn the language of the cows','/images/club/1686210827551-bezkoder-pngwing.com.png','Culture and Languages','active'), (7,'Adelaide University Chess Club','The Adelaide University Chess Club, or UofAChess for short, has been around in its new form since 2009 (and in another, lapsed form for decades), and is host to a fun atmosphere of recreational games of chess and go.','/images/club/1686201015207-bezkoder-chess club.jpg','Hobbies','active'),(8,'Adelaide University Comedy Club','We are a club for watching, and for those who are keen, practising comedy! This includes any form of comedy people want to try out such as sketch or impro, but specifically stand-up comedy!','/images/club/1686201062274-bezkoder-144158295_234669931471707_2368364429815757606_n(1).jpg','Hobbies','active'),(9,'Entrepreneur Club','The Adelaide University Entrepreneur Club brings students together who have an interest in entrepreneurship and innovation. We aim to promote entrepreneurship to students, no matter their faculty and background, and support student entrepreneurs through the network, relationships, and resources available to our club.','/images/club/1686201120437-bezkoder-3435425_2_10534636_450639498409795_5040486039051317410_n.png','Skills Development','active'),(10,'University of Adelaide Model UN Club','Adelaide University Model United Nations Club holds Model UN competitions for Adelaide students. These competitions are a fun and engaging way to promote global awareness, education, teamwork, diplomacy skills, and public speaking. They’re a fun chance for students of all abilities to come together to debate real world events and propose potential solutions from the perspectives of their countries.','/images/club/1686201161669-bezkoder-model un.png','Skills Development','active');
/*!40000 ALTER TABLE `club` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club_member`
--

DROP TABLE IF EXISTS `club_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_member` (
  `user_email` varchar(320) NOT NULL,
  `club_id` smallint unsigned NOT NULL,
  `role` enum('member','manager') NOT NULL DEFAULT (_utf8mb4'member'),
  `receive_post_updates` tinyint(1) DEFAULT (false),
  `receive_event_updates` tinyint(1) DEFAULT (false),
  PRIMARY KEY (`user_email`,`club_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `club_member_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `user` (`email`) ON DELETE CASCADE,
  CONSTRAINT `club_member_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_member`
--

LOCK TABLES `club_member` WRITE;
/*!40000 ALTER TABLE `club_member` DISABLE KEYS */;
INSERT INTO `club_member` VALUES ('1M@langen2023.com',1,'manager',0,0),('1M@langen2023.com',2,'manager',0,0),('1U@langen2023.com',2,'member',0,0),('1U@langen2023.com',5,'member',0,0),('2M@langen2023.com',2,'manager',0,0),('2M@langen2023.com',3,'manager',0,0),('2U@langen2023.com',1,'member',0,0),('2U@langen2023.com',2,'member',0,0),('2U@langen2023.com',3,'member',0,0),('2U@langen2023.com',4,'member',0,0),('2U@langen2023.com',5,'member',0,0),('2U@langen2023.com',6,'member',0,0),('3M@langen2023.com',4,'manager',0,0),('4M@langen2023.com',5,'manager',0,0),('4M@langen2023.com',6,'manager',0,0),('4U@langen2023.com',1,'member',0,0),('4U@langen2023.com',2,'member',0,0),('4U@langen2023.com',3,'member',0,0),('4U@langen2023.com',4,'member',0,0),('4U@langen2023.com',5,'member',0,0),('4U@langen2023.com',6,'member',0,0),('5U@langen2023.com',4,'member',1,1),('7U@langen2023.com',2,'member',0,0),('7U@langen2023.com',4,'member',0,0),('7U@langen2023.com',5,'member',0,0),('10U@langen2023.com',7,'member',0,0),('10U@langen2023.com',9,'member',0,0),('11U@langen2023.com',7,'member',0,0),('11U@langen2023.com',8,'member',0,0),('11U@langen2023.com',9,'member',0,0),('11U@langen2023.com',10,'member',0,0),('14U@langen2023.com',7,'member',0,0),('15U@langen2023.com',9,'member',0,0),('15U@langen2023.com',10,'member',0,0),('5M@langen2023.com',7,'manager',0,0),('6M@langen2023.com',8,'manager',0,0),('7M@langen2023.com',9,'manager',0,0),('8M@langen2023.com',10,'manager',0,0),('8U@langen2023.com',7,'member',0,0),('8U@langen2023.com',10,'member',0,0),('9U@langen2023.com',8,'member',1,1);
/*!40000 ALTER TABLE `club_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `club_id` smallint unsigned NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` varchar(1000) DEFAULT (_utf8mb4''),
  `location` varchar(200) DEFAULT NULL,
  `event_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `event_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES (1,1,'Club Orientation (2023)','Club orientation event for Adelaide Christian Club.','Adelaide UniBar','2023-06-09 13:30:00'),(2,1,'t','t','t','2023-06-01 15:33:00'),(3,1,'Bible Study','Join us for a session of Bible study on Friday.','Adelaide Christian Club Room','2023-06-16 20:00:00'),(7,1,'Bible Study','Another Bible Study session','Adelaide Christian Club Room','2023-06-23 20:00:00'),(8,2,'Club Orientation (2023)','Orientation event where we get to know each other and what the club will be doing this year.','Philosophy and Religion Room','2023-06-09 15:30:00'),(9,2,'Debate','Come debate with us on topics ranging throughout the topics of Philosophy and Religion.','Philosophy and Religion Room','2023-06-30 19:40:00'),(10,3,'Club Orientation','Sciences, Engineering and Technology orientation event.','SET Building','2023-06-16 12:30:00'),(11,3,'Math Competition','Winner gets $50.','SET Building','2023-06-20 11:50:00'),(12,4,'Club Orientation','Come join us.','English Room','2023-06-07 13:05:00'),(13,4,'Book Club','Reading time :)','English Room','2023-06-14 17:10:00'),(14,5,'🐮','🐮','🐮','2023-06-09 13:30:00'),(15,5,'🐮','🐮','🐮','2023-06-10 13:30:00'),(16,6,'THERE ARE NO EVENTS','NO EVENTS','NO','2100-12-31 23:11:00'),(17,7,'Chess World Cup Watch Party','Watch Party for watching the grand championship between two chess grand masters.','Uni of Adelaide Hub Central Level 4','2023-10-07 11:00:00'),(18,7,'Chess Learning Workshop','A workshop for students interested in learning the basics of chess. We encourage students of all levels to come and join in this workshop. Free pizzas would be provided to the RSVPs as well.','IW 218 room, Level 2','2023-08-10 12:00:00'),(19,7,'Chess Tournament','A friendly tournament between the students of University of Adelaide and University of South Australia!','Barr Smith South','2023-12-12 15:00:00'),(20,7,'Chess workshop','A chess workshop to help increase your chess ratings.','IW 218','2023-06-07 11:00:00'),(21,7,'Chess World Championship Watch Party','Come and join us in watching the chess world championship 2022. We will be analyzing their moves and discussing their game plans!','Duck Lounge','2022-11-11 11:11:00'),(22,7,'Chess Puzzles  ','Come and join us where we will discuss the most difficult chess puzzles trying to solve them.  ','IW 219  ','2023-05-08 11:00:00'),(23,8,'Matt Rife event','We are pleased to announce that Matt Rife would be joining us in the University of Adelaide giving us his special stand up set.','Scott Theatre','2023-07-31 20:00:00'),(24,8,'Improv Practice ','We encourage all students to come to our improv workshop and take a shot at it. Free pizzas provided ','Uni of Adelaide Bar ','2023-10-09 19:00:00'),(25,8,'Stand-up Workshop','Hi, we are pleased to announce that Dave Chapelle has agreed to come and provide us with his insights in being a better stand up artist.','Scott Theatre','2023-12-12 21:00:00'),(26,8,'Abhishek Upmanyu','We are pleased to announce that Abhishek will be presenting his set in our University this November.','Scott Theatre','2022-11-18 20:00:00'),(27,8,'Improv Workshop','We welcome everyone to come and try their skills at improv. You never know what you learn from these workshops.','Barr Smith South','2023-04-01 21:00:00'),(28,8,'Stand Up Show','A student of the University of Adelaide and a proud member of the Adelaide University Comedy Club is going to present his first show in our university. Tickets start at $15.','Napier 212','2023-01-05 22:00:00'),(29,9,'Space and Innovation Hackathon','This is the innovation event of the year!','Adelaide Oval','2023-07-31 16:00:00'),(30,9,'Networking Event','We have a networking event for all students that would help you create a professional network.','Nexus ground floor','2023-06-18 12:00:00'),(31,9,'Monopoly Night','A board game to just have fun with your peers','IW 219','2023-12-12 21:11:00'),(32,9,'Job Applications 101','How to ace your job application every single time','Level 4 Uni of Adelaide Hub Central','2023-05-09 11:00:00'),(33,9,'Brick and Mortar Crawl','Pub Crawl!!!','Unibar','2022-11-09 20:00:00'),(34,9,'Social Entrepreneurship Panel  ','In the spirit of Sustainability Week, the AUEC is presenting a Social Entrepreneur Panel featuring experienced entrepreneurs running successful social enterprises around South Australia!  ','IW 218  ','2022-08-08 14:00:00'),(35,10,'UN Watch Party','A watch party to see what they will do this Friday!','The Braggs','2023-10-17 10:02:00'),(36,10,'WHO response reading','Analysis of the response of WHO\'s covid-19 protocol','Scott theatre','2023-11-01 11:11:00'),(37,10,'Model UN','We are hosting a model UN in our university','Helen Mayo South 20','2023-10-10 09:00:00'),(38,10,'Model UN practice','We are hosting practice for the model UN being hosted in our University!','IW218','2023-03-13 11:00:00'),(39,10,'Model UN tryouts','We are creating a model UN team to attend a model UN being hosted in the University of Melbourne. If you are interested feel free to join!','Scott Theatre ','2022-01-19 11:00:00'),(40,10,'UN watch party','We will be watching and debating on the decisions being made by UN today','IW 219','2021-06-05 12:00:00');
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_coordinator`
--

DROP TABLE IF EXISTS `event_coordinator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_coordinator` (
  `user_email` varchar(320) NOT NULL,
  `event_id` smallint unsigned NOT NULL,
  `manager_phone` int DEFAULT NULL,
  PRIMARY KEY (`user_email`,`event_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_coordinator_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `user` (`email`) ON DELETE CASCADE,
  CONSTRAINT `event_coordinator_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_coordinator`
--

LOCK TABLES `event_coordinator` WRITE;
/*!40000 ALTER TABLE `event_coordinator` DISABLE KEYS */;
INSERT INTO `event_coordinator` VALUES ('1M@langen2023.com',1,411111111),('1m@langen2023.com',2,0),('1m@langen2023.com',3,411111111),('1m@langen2023.com',7,411111111),('2M@langen2023.com',8,412345678),('2M@langen2023.com',9,412345678),('2M@langen2023.com',10,412345678),('2M@langen2023.com',11,412345678),('3M@langen2023.com',12,0),('3M@langen2023.com',13,0),('4M@langen2023.com',14,1),('4M@langen2023.com',15,1),('4M@langen2023.com',16,1),('5M@langen2023.com',17,41122334),('5M@langen2023.com',18,41122334),('5M@langen2023.com',19,41122334),('5M@langen2023.com',20,41122334),('5M@langen2023.com',21,41122334),('5M@langen2023.com',22,41122334),('6M@langen2023.com',23,41122334),('6M@langen2023.com',24,41122334),('6M@langen2023.com',25,41122334),('6M@langen2023.com',26,41122334),('6M@langen2023.com',27,41122334),('6M@langen2023.com',28,41122334),('7M@langen2023.com',29,41122334),('7M@langen2023.com',30,41122334),('7M@langen2023.com',31,41122334),('7M@langen2023.com',32,41122334),('7M@langen2023.com',33,41122334),('7M@langen2023.com',34,41122334),('8M@langen2023.com',35,41122334),('8M@langen2023.com',36,41122334),('8M@langen2023.com',37,41122334),('8M@langen2023.com',38,41122334),('8M@langen2023.com',39,41122334);
/*!40000 ALTER TABLE `event_coordinator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `user_email` varchar(320) NOT NULL,
  `club_id` smallint unsigned NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` varchar(500) DEFAULT (_utf8mb4''),
  `picture` varchar(500) DEFAULT NULL,
  `visibility` enum('public','private') NOT NULL DEFAULT (_utf8mb4'public'),
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_email` (`user_email`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `user` (`email`) ON DELETE CASCADE,
  CONSTRAINT `post_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (1,'1M@langen2023.com',1,'First Post','Welcome to our club. I hope you enjoy your stay :)','/images/club/post/1686202250313-9665-worrylove.png','private','2023-06-08 05:30:50'),(2,'1M@langen2023.com',1,'Philosophy and Religion','If you\'re interested in all things Philosophy and Religion, you should check out my other club of the same name. We discuss a broader range of topics apart from Christianity.',NULL,'public','2023-06-08 05:38:52'),(3,'1M@langen2023.com',1,'Test Post','This is a test post',NULL,'public','2023-06-08 05:39:30'),(4,'1M@langen2023.com',1,'Re: previous post','Regarding the previous post, please ignore that. I am still getting used to this system and did not mean to create that post.',NULL,'public','2023-06-08 05:40:12'),(5,'1M@langen2023.com',2,'Philosophy and Religion','Hello, everyone. Thank you for joining the club. This is my second club and I have another one called \"Adelaide Christian Club\" if you are interested in joining.',NULL,'private','2023-06-08 05:46:10'),(6,'1m@langen2023.com',1,'Verse of the Day','An evil man is trapped by his sinful talk, but a righteous man escapes trouble.\r\n\r\n—Proverbs 12:13','/images/club/post/1686205210484-5936.jpg','public','2023-06-08 06:20:10'),(7,'1m@langen2023.com',1,'Lost Bible','At one of our previous events, someone left their Bible. If you lost yours, please pick it up at our club room.',NULL,'private','2023-06-08 06:20:56'),(8,'2M@langen2023.com',2,'New Manager','Hello this is Palle and I am a new manager for this club.',NULL,'public','2023-06-08 06:50:38'),(9,'2M@langen2023.com',2,'This is one of my favourite quotes.','“Two things are infinite: the universe and human stupidity; and I\'m not sure about the universe.”\r\n\r\n― Albert Einstein','/images/club/post/1686207309154-9810.jpg','public','2023-06-08 06:55:09'),(10,'2M@langen2023.com',3,'Welcome To SET Club','Welcome to the Sciences, Engineering and Technology Club.',NULL,'private','2023-06-08 07:18:04'),(11,'2M@langen2023.com',3,'Math Competition','We are running a math competition event soon so make sure to sign up if you want to enter for the change to win $50.',NULL,'public','2023-06-08 07:23:29'),(12,'2M@langen2023.com',3,'Math Competition','Just to clarify the previous post. Anyone is able to join and you don\'t have to be joined in the club or even be in the SET Faculty.',NULL,'public','2023-06-08 07:24:18'),(13,'3M@langen2023.com',4,'Welcome Post','Welcome to the English Club :)',NULL,'private','2023-06-08 07:36:24'),(14,'3M@langen2023.com',4,'Quote of the Day','\"Not all those who wander are lost.\"\r\n\r\n- J. R. R. Tolkein',NULL,'public','2023-06-08 07:37:00'),(15,'3M@langen2023.com',4,'Some ramblings...','Have you guys ever thought of writing a book? Because I haven\'t. Well, obviously I have but superficially. I don\'t think we realise how hard of a task it is to actually plan and write a book.',NULL,'public','2023-06-08 07:40:33'),(16,'3M@langen2023.com',4,'...','Well you know what\'s funny. I actually did really well in English in my high school years. Not like it actually matters now.',NULL,'public','2023-06-08 07:41:07'),(17,'3M@langen2023.com',4,':)','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',NULL,'private','2023-06-08 07:41:52'),(18,'4M@langen2023.com',5,'moo','mooooooo hola','/images/club/post/1686210308789-pngwing.com.png','public','2023-06-08 07:45:08'),(19,'4M@langen2023.com',5,'mooooo','mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo mooooo moo','/images/club/post/1686210635770-pngwing.com.png','public','2023-06-08 07:50:35'),(20,'4M@langen2023.com',5,'🐮','🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮🐮',NULL,'public','2023-06-08 07:51:37'),(21,'4M@langen2023.com',5,'🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄','🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄','/images/club/post/1686210783979-pngwing.com.png','private','2023-06-08 07:53:03'),(22,'5M@langen2023.com',7,'Chess Workshop','I am so excited to see all of you in the upcoming chess workshop! Feel free to invite your friends and help grow the chess community.',NULL,'public','2023-06-08 05:22:14'),(23,'5M@langen2023.com',7,'Chess Tournament','I hope you all are preparing for the upcoming tournament. Don\'t forget that the winner of the tournament will be given $25,000. See you during the tournament.',NULL,'public','2023-06-08 05:24:32'),(24,'5M@langen2023.com',7,'Chess Board','Hi, we recently received new chess boards from the university so feel free to come and see them. Only members are allowed to see them. Feel free to come to Duck Lounge at 5 pm today. ','/images/club/post/1686202067769-luxury_wood_chess_table_exclusive_hight_end_wood_chess_table_royale_1_.jpg','private','2023-06-08 05:27:47'),(25,'5M@langen2023.com',7,'Chess Workshop June','Thanks to everyone who attended yesterday\'s chess workshop. It was amazing seeing you all participate in it. ','/images/club/post/1686202314719-c4w6lqykhemo5cbdatlc.webp','public','2023-06-08 05:31:54'),(26,'5M@langen2023.com',7,'Congratulations','A huge congratulations to Magnus Carlsen in becoming the world champion yet again.','/images/club/post/1686202403374-0262ecb765f5e79491557a65fa12cd7a.webp','public','2023-06-08 05:33:23'),(27,'5M@langen2023.com',7,'Member Workshop','Just a PSA for members, the upcoming workshop is free to attend for members so we welcome you to come and have a look.',NULL,'private','2023-06-08 05:34:25'),(28,'5M@langen2023.com',7,'Watch party','All members will be provided with free pop corn and nachos during the watch party. Don\'t forget to get your membership ID with you. See you all there!','/images/club/post/1686202567760-exps8421_MTC153706B03_03_2b.jpg','private','2023-06-08 05:36:07'),(29,'5M@langen2023.com',7,'Manager Update','Hi, as you know the last club manager has gracefully resigned the club. I, 5M, am you new club manager!',NULL,'private','2023-06-08 05:37:17'),(30,'6M@langen2023.com',8,' Matt Rife Tickets','Livenation is providing  a special 25% discount on the prices of the Matt Rife show to the members of this club. Hurry up before they all sell out!','/images/club/post/1686203606183-Fn6TrsXWIAEH-Wv.jpg','private','2023-06-08 05:53:26'),(31,'6M@langen2023.com',8,'Improv practice','$15 food vouchers to all club members.\r\n\r\nTheir one time use code is: 1adCc',NULL,'private','2023-06-08 05:54:23'),(32,'6M@langen2023.com',8,'New manager','6M is the new manager for this club!','/images/club/post/1686203746906-new-manager-communicating-upwards.png','private','2023-06-08 05:55:46'),(33,'6M@langen2023.com',8,'Members only event','We have a surprise event being announced soon which can only be accessed by members. Watch out!',NULL,'private','2023-06-08 05:58:01'),(34,'6M@langen2023.com',8,'9U','A huge congratulations to 9U for selling out his first stand up show in Napier. ','/images/club/post/1686203969312-full-house-at-olympia-theater-pic1.jpg','public','2023-06-08 05:59:29'),(35,'6M@langen2023.com',8,'Improv Workshop','After huge success in the last workshop, we are pleased to announce that we are working to plan another workshop pretty soon. ',NULL,'public','2023-06-08 06:00:33'),(36,'6M@langen2023.com',8,'Dave Chapelle','Who else is excited to meet Dave Chapelle? See you all in Scott Theatre on 12th December.','/images/club/post/1686204180743-image.webp','public','2023-06-08 06:03:00'),(37,'6M@langen2023.com',8,'Improv Workshop Cancelled','We have received an overwhelming response from the students but unfortunately we have to cancel the improv workshop. Turn on your notifications to get updates regarding all events and posts and the changes made in them, in case you miss any!',NULL,'public','2023-06-08 06:04:39'),(38,'7M@langen2023.com',9,'Panel information','Our panelists will be discussing the opportunities, challenges, and key trends in this field, as well as sharing their own experiences and the impact their organisations are having. They\'ll give valuable practical advice on how you can potentially contribute to a social cause meaningfully and bring change to the world through entrepreneurship.','/images/club/post/1686204938461-Screenshot 2023-06-08 at 3.44.22 pm.png','public','2023-06-08 06:15:38'),(39,'7M@langen2023.com',9,'Going Global','We\'re partnering with @foundersclub_freiburg to bring you an internatuonal panel event featuring speakers from ecosystems in both of our countries. It\'s promising to be an exciting and enlightening talk - check our FB for event details!',NULL,'public','2023-06-08 06:16:06'),(40,'7M@langen2023.com',9,'Brick and Mortar Pub Crawl','What you\'ll get: \r\n-Get to know local businesses around the Adelaide CBD*\r\n-Discounts & freebies from multiple stores \r\n-Free lunch & networking opportunity with business owners\r\n-Customisable tote bag when you collect it from our AUEC stall this Thursday and Friday! \r\nGrab a friend and get in QUICK before they sell out! Link in bio ','/images/club/post/1686205045887-Screenshot 2023-06-08 at 3.47.15 pm.png','public','2023-06-08 06:17:25'),(41,'7M@langen2023.com',9,'Study Abroad','​Endeavour Singapore is a two-week immersive program for explorers who want to go beyond the horizon. It is a study tour like no other. Bring a new or existing startup idea and dedicate yourself to making it real.\r\n​Whether you want to give your career a kickstart by through industry mentorships or explore your passions by developing your own start up, Endeavour Singapore is the program for you.\r\n​Join HEX\'s upcoming info sesh on Tuesday 22 March at 3pm AEDT to meet the team and get all your que',NULL,'public','2023-06-08 06:18:13'),(42,'7M@langen2023.com',9,'Members only opportunity','For those interested in entrepreneurship but not sure where to start...\r\nLove learning at your own pace? Join HEX’s 6-month do-it-whenever experience designed to help you build industry skills and develop a futurist mindset. \r\nPowered by Atlassian, HEX Ed is a 6-month do-it-whenever experience designed to give you the career boost you need with access to industry experts, tech leaders, and startup founders. And the best part? You can do HEX Ed while working, traveling, or gaming! \r\n','/images/club/post/1686205147121-Screenshot 2023-06-08 at 3.48.54 pm.png','private','2023-06-08 06:19:07'),(43,'7M@langen2023.com',9,'New manager','Congratulations to 7M for becoming the youngest manager of our club!',NULL,'private','2023-06-08 06:19:45'),(44,'7M@langen2023.com',9,'Members Only opportunity','Pre-launch marketing is the foundation stage of any marketing plan to raise awareness and build excitement for your brand.\r\nOur fellow member is launching a social impact start-up which is in Pre-launch marketing phase. Show them your support by subscribing to their newsletter and help them turn this idea into reality.\r\nGiverly is a social impact start-up that converts our everyday online shopping into free and meaningful donations towards some of the most pressing social issues. \r\nBe the first ','/images/club/post/1686205240102-Screenshot 2023-06-08 at 3.50.32 pm.png','private','2023-06-08 06:20:40'),(45,'7M@langen2023.com',9,'Free entry','Our friends from the @uamssadl are hosting an event next week Wednesday 14 October!\r\nWant to know what it takes to succeed in marketing? Aspiring to direct a large scale marketing campaign one day?\r\nHear from UAMSS’s upcoming guest speaker, David O\'Loughlin! David is the CEO of KWP!, a national marketing agency which oversees some of Australia’s biggest brands, such as Coopers.\r\nOur members have free entry!',NULL,'private','2023-06-08 06:21:23'),(46,'8M@langen2023.com',10,'WHO crisis','Who else disagrees with what WHO did today?','/images/club/post/1686205987172-YF_H68EL_400x400.jpg','public','2023-06-08 06:33:07'),(47,'8M@langen2023.com',10,'What will a typical day in committee look like?','There are no standards in Model UN and different conferences may run their debate and rules of procedure differently. The two most commonly used rules of procedure are North American/ UNA-USA procedure and THIMUN procedure; most conferences’ rules of procedure are copied or modified from those two. A new procedure based on the actual proceedings of the United Nations has begun to grow, called UN4MUN procedure, and is taking root in MUN committees worldwide. Also, some crisis committees may opera',NULL,'public','2023-06-08 06:34:20'),(48,'8M@langen2023.com',10,'How do I prepare for my first conference?','Once you have signed up for a conference, you will receive your country assignment, your committee, and its topics. Most conferences provide a Background Guide or Topic Synopsis that introduces the topics — read that first.\r\n\r\nThere are typically three items to prepare before you walk into your first conference: the Position Paper (sometimes called a Policy Statement), your Opening Speech, and a Research Binder. Some novice conferences may also require a Country Profile.',NULL,'public','2023-06-08 06:35:18'),(49,'8M@langen2023.com',10,'What is Model UN and how do I sign up?Model United','Model United Nations is an academic simulation of the United Nations where students play the role of delegates from different countries and attempt to solve real world issues with the policies and perspectives of their assigned country. For example, a student may be assigned the United Kingdom and will have to solve global topics such as nuclear non-proliferation or climate change from the policies and perspectives of the United Kingdom.','/images/club/post/1686206167662-ir-modelUNpoland1280x480.jpg','public','2023-06-08 06:36:07'),(50,'8M@langen2023.com',10,'New manager','I am the new manager for this club!',NULL,'private','2023-06-08 06:36:24'),(51,'8M@langen2023.com',10,'This is a test private post ','I am just checking if private posts work or not in this club!',NULL,'private','2023-06-08 06:36:55'),(52,'8M@langen2023.com',10,'Members only event','We will be visiting the HQ of the UN. Only members can join in this adventure. Hope you all are as excited as we are!','/images/club/post/1686206288434-rtr3hsmz.jpg.webp','private','2023-06-08 06:38:08'),(53,'8M@langen2023.com',10,'WHO HQ ','Members will be visiting WHO HQ!','/images/club/post/1686206343667-dg_dr-tedros.jpg','private','2023-06-08 06:39:03');
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `email` varchar(320) NOT NULL,
  `username` varchar(18) NOT NULL DEFAULT (_utf8mb4''),
  `password` varchar(128) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT (_utf8mb4'user'),
  PRIMARY KEY (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('1M@langen2023.com','Manager1','$argon2id$v=19$m=65536,t=3,p=4$JoYsg+DDbLEgiitCNtVPsw$YIazvdyh6uDghCkiNdJTumuE+0hXZ9lP98Hh4T0rFos','user'),('1U@langen2023.com','User1','$argon2id$v=19$m=65536,t=3,p=4$UfRfXKcFfg3+gwien3JYfQ$POZ/04eb3Yout55dE5ZBPADUpNRxPx/6ySEwYkfIZYE','user'),('2M@langen2023.com','Manager2','$argon2id$v=19$m=65536,t=3,p=4$XMiEzHCIFRuQWhqX4EQAWA$98UKEwF8ndP6e3tdBR6K9HaRnj4hc6Fn6UhblybrcGM','user'),('2U@langen2023.com','User2','$argon2id$v=19$m=65536,t=3,p=4$MuxD5ZHgY9IJpvxSDKlyDg$P3fGg2c1jkaJp230OGEtQ0kPM7NaqSZgtj9NuTpF/+U','user'),('3M@langen2023.com','Manager3','$argon2id$v=19$m=65536,t=3,p=4$Py54TzbR4upry/uZchR0SA$OII6Gmns9z/uyBZF6eVLRCCgESfc6wAUEZV+/WmhMEY','user'),('3U@langen2023.com','User3','$argon2id$v=19$m=65536,t=3,p=4$Y3UrfMu6ezuNUOZyZeSbKw$+StQqwJ32q/hcq+V/VERaG/dC5QeSryAA0vMifntSrI','user'),('4M@langen2023.com','Manager4','$argon2id$v=19$m=65536,t=3,p=4$D+kmQTqO53wGJUkmTY1GQQ$yL6Pw6Dus0NbEKPSLKK32led7rMThcnr3WehzGoC9s4','user'),('4U@langen2023.com','User4','$argon2id$v=19$m=65536,t=3,p=4$unzZDAjNTYphbQAuB0vrcw$ybPxpIfHaYX9qYixX9W+qCnttaE6ZxzP3KLJsbYd4p4','user'),('5U@langen2023.com','User5','$argon2id$v=19$m=65536,t=3,p=4$NgSGpwSAbWDMaVA5Rsf5KA$XDiOs9VvmfP+BUWnoT7w7S/XNlF1QGFKN/DYOOaWRWE','user'),('6U@langen2023.com','User6','$argon2id$v=19$m=65536,t=3,p=4$WokEd0G0nT9QgqwkybCb6w$E7IRR21pbSOD83zXG7IGKbYLgR03gE/P5P0rwtDQq8A','user'),('7U@langen2023.com','User7','$argon2id$v=19$m=65536,t=3,p=4$d84saPL/mrKAemW0oTFKaw$nNh2gdHDQGxFhjEifC8jcufxY4UESaA1jE22Yxvocws','user'),('langen2023@gmail.com','langen','$argon2id$v=19$m=65536,t=3,p=4$P8g1jHimsKpnZyp3n1mjpg$MpoJFn/Vc57Rz2EEEUNq26MatHYXDdCiqARZY+UgpC8','admin'),('10U@langen2023.com','10U','$argon2id$v=19$m=65536,t=3,p=4$dDJOWrqfmP5dWnfrLKA+wQ$DS1kniuuOv0oeD4T+tggot4ZoWnGW5YZLtb3HlondjY','user'),('11U@langen2023.com','11U','$argon2id$v=19$m=65536,t=3,p=4$FARLxOs+J0arnY6fEbrCTg$uDiatoXed3H7MYZveitOTvJ9sac2jXTXSjiOWnBDRvI','user'),('12U@langen2023.com','12U','$argon2id$v=19$m=65536,t=3,p=4$6Oalogl9fI54TW/Ji6idCQ$Ez2yQ5w1RfZMB11O10NFSc63aMywOCyL8+wyTAuVyqQ','user'),('13U@langen2023.com','13U','$argon2id$v=19$m=65536,t=3,p=4$xLLnvFsm+PeKnBHiaLpE0Q$3cXZO/8dFxsUQWynHOoPn+y5/ij+Gm/EGmsWAHb9JGE','user'),('14U@langen2023.com','14U','$argon2id$v=19$m=65536,t=3,p=4$fQ32SI/yWkUaZ9/KZy+IVA$I/6WJ2L5IXt7wIBR7qlnTrESGGPWirjiwoctMoAp2Cc','user'),('15U@langen2023.com','15U','$argon2id$v=19$m=65536,t=3,p=4$rvN4a8oiYv8I58SxTOyqGw$es20IRr3lg4i/lSETNppXsWB2v5RLkt1mE34Y5/Yg0k','user'),('5M@langen2023.com','5M','$argon2id$v=19$m=65536,t=3,p=4$qtgHXqe3VaiHF/XEEEb5nA$fMvsnop3dqznF0RTIDGrUKCUuhDfY7WmexQcOedmUq0','user'),('6M@langen2023.com','6M','$argon2id$v=19$m=65536,t=3,p=4$nislT1DN8qlSbOq1ekufwA$1NqzLdNyi7hxe/RZYlHvOEIBrwvgdhoJ0FPZ4vRAPXw','user'),('7M@langen2023.com','7M','$argon2id$v=19$m=65536,t=3,p=4$B54OAZeEcDcm4TuX7PqNGA$SlcZLM+7f5ViJOuyQYuFq1N9ZUyT1eulAWRTKkzUbeg','user'),('8M@langen2023.com','8M','$argon2id$v=19$m=65536,t=3,p=4$FiPZM8PdQGjJYwIMn0pH2Q$3WSbQZMELlkyor/RV+YgheqPtiZ2RlojPN/5K4cJS5A','user'),('8U@langen2023.com','8U','$argon2id$v=19$m=65536,t=3,p=4$a4sPMUmp8zxAm12j22suhg$dtLcYKeU3x4Z3cNqBAcIS9uj1bJ1VzhmuV/0/Nc9KcE','user'),('9U@langen2023.com','9U','$argon2id$v=19$m=65536,t=3,p=4$k4YDqHxovGp/n1eYm8Dn5w$FtEw9YqIZLOQsDpTZqEBLGpnwFSd1YYU2xvYPQLvS3Y','user');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `ui_trigger` AFTER INSERT ON `user` FOR EACH ROW BEGIN
  INSERT INTO user_info (user_email) VALUES (NEW.email);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info` (
  `user_email` varchar(320) NOT NULL,
  `firstname` varchar(18) DEFAULT (_utf8mb4''),
  `lastname` varchar(18) DEFAULT (_utf8mb4''),
  `contact` varchar(500) DEFAULT (_utf8mb4''),
  `biography` varchar(500) DEFAULT (_utf8mb4''),
  `profile_picture` varchar(500) DEFAULT (_utf8mb4'/images/users/profile/default.png'),
  PRIMARY KEY (`user_email`),
  CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `user` (`email`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
INSERT INTO `user_info` VALUES ('1M@langen2023.com','Ramesses','Christiane','Don\'t contact me :)','I\'m a devout Christian so I started a Christianity club','/images/users/profile/1M@langen2023.com/227d84f8a38d56dbe48c92c00.jpg'),('1U@langen2023.com','hello','i am a user','','','/images/users/profile/default.png'),('2M@langen2023.com','Palle','Olaug','','','/images/users/profile/default.png'),('2U@langen2023.com','','','','','/images/users/profile/default.png'),('3M@langen2023.com','Iain','Pollux','','','/images/users/profile/default.png'),('3U@langen2023.com','','','','','/images/users/profile/default.png'),('4M@langen2023.com','cow','cow','cow','cow','/images/users/profile/4M@langen2023.com/64d961f470211046fa43a2100.com.png'),('4U@langen2023.com','','','','','/images/users/profile/default.png'),('5U@langen2023.com','','','','','/images/users/profile/default.png'),('6U@langen2023.com','','','','','/images/users/profile/default.png'),('7U@langen2023.com','','','','','/images/users/profile/default.png'),('langen2023@gmail.com','','','','','/images/users/profile/default.png'),('10U@langen2023.com','','','','','/images/users/profile/default.png'),('11U@langen2023.com','','','','','/images/users/profile/default.png'),('12U@langen2023.com','','','','','/images/users/profile/default.png'),('13U@langen2023.com','','','','','/images/users/profile/default.png'),('14U@langen2023.com','','','','','/images/users/profile/default.png'),('15U@langen2023.com','','','','','/images/users/profile/default.png'),('5M@langen2023.com','','','','','/images/users/profile/default.png'),('6M@langen2023.com','','','','','/images/users/profile/default.png'),('7M@langen2023.com','','','','','/images/users/profile/default.png'),('8M@langen2023.com','','','','','/images/users/profile/default.png'),('8U@langen2023.com','','','','','/images/users/profile/default.png'),('9U@langen2023.com','','','','','/images/users/profile/default.png');
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_session`
--

DROP TABLE IF EXISTS `user_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_session` (
  `session` varchar(500) NOT NULL,
  `user_email` varchar(320) NOT NULL,
  `expiry_date` timestamp NOT NULL DEFAULT ((now() + interval 1 day)),
  PRIMARY KEY (`session`),
  KEY `user_email` (`user_email`),
  CONSTRAINT `user_session_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `user` (`email`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_session`
--

LOCK TABLES `user_session` WRITE;
/*!40000 ALTER TABLE `user_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_session` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-08  8:44:41
