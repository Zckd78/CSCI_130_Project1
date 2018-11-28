-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.21 - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for picross
DROP DATABASE IF EXISTS `picross`;
CREATE DATABASE IF NOT EXISTS `picross` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `picross`;

-- Dumping structure for table picross.game
DROP TABLE IF EXISTS `game`;
CREATE TABLE IF NOT EXISTS `game` (
  `Key` int(11) NOT NULL AUTO_INCREMENT,
  `PlayerKey` int(11) NOT NULL DEFAULT '0',
  `Duration` int(11) NOT NULL DEFAULT '0',
  `Errors` int(11) NOT NULL DEFAULT '0',
  `LevelKey` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Key`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table picross.levels
DROP TABLE IF EXISTS `levels`;
CREATE TABLE IF NOT EXISTS `levels` (
  `Key` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `LevelNumber` int(11) NOT NULL,
  `GridSize` int(11) NOT NULL,
  `LevelData` json NOT NULL,
  PRIMARY KEY (`Key`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table picross.players
DROP TABLE IF EXISTS `players`;
CREATE TABLE IF NOT EXISTS `players` (
  `Key` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(100) NOT NULL DEFAULT '0',
  `Password` varchar(500) NOT NULL DEFAULT '0',
  `FirstName` varchar(500) NOT NULL DEFAULT '0',
  `LastName` varchar(500) NOT NULL DEFAULT '0',
  `Age` int(11) NOT NULL DEFAULT '0',
  `Gender` varchar(50) NOT NULL DEFAULT '0',
  `Location` varchar(500) NOT NULL DEFAULT '0',
  `Icon` varchar(500) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Key`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
