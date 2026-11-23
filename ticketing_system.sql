-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2026 at 04:19 PM
-- Server version: 10.11.19-MariaDB
-- PHP Version: 8.3.37

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+08:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ticketing_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `bookID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `eventID` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `bookStatus` enum('Pending','Confirmed','Cancelled','') NOT NULL DEFAULT 'Pending',
  `bookedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`bookID`, `userID`, `eventID`, `quantity`, `totalAmount`, `bookStatus`, `bookedAt`) VALUES
(8, 1, 7, 4, 8.88, 'Pending', '2026-11-23 23:12:33');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `eventID` int(11) NOT NULL,
  `eventName` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `venue` varchar(150) NOT NULL,
  `eventImage` varchar(255) NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `totalTickets` int(11) NOT NULL,
  `availableTickets` int(11) NOT NULL,
  `currentStatus` enum('Upcoming','Ongoing','Ended','Cancelled') NOT NULL DEFAULT 'Upcoming',
  `dateCreated` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`eventID`, `eventName`, `description`, `venue`, `eventImage`, `startTime`, `endTime`, `price`, `totalTickets`, `availableTickets`, `currentStatus`, `dateCreated`, `updatedAt`) VALUES
(1, 'Renz Singing concert', 'si renz kakanta ng bahay kubo ng wala sa tono', 'dito lang', 'https://rockymountevents.com/wp-content/uploads/2019/06/Concert-crowd-with-silhouettes-of-people-hold-their-hands-up.jpg', '2026-11-11 06:23:50', '2026-11-12 13:23:50', 500.25, 500, 500, 'Ended', '2026-11-11 13:24:46', '2026-11-23 23:19:00'),
(6, 'Concert ni mariane', 'dko din alam kung ano gagawin nya eh', 'dun sa kanila tanong mo', 'https://art.ngfiles.com/images/5197000/5197218_184222_hyacinthhana_untitled-5197218.53d010bacc8291599f5e38065fbfc577.webp?f1699603311', '2026-11-22 20:08:00', '2026-11-24 18:08:00', 20.00, 22, 22, 'Ongoing', '2026-11-23 02:09:00', '2026-11-23 23:19:00'),
(7, 'Jaybee22', 'concert nya daw', 'kahit san', 'https://images.lifestyleasia.com/wp-content/uploads/sites/7/2023/02/27205409/Events-in-India-this-March-1-1600x900.jpg?tr=w-1600', '2026-11-24 11:08:00', '2026-11-26 11:08:00', 2.22, 22, 15, 'Upcoming', '2026-11-23 03:09:01', '2026-11-23 23:19:00');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(11) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contactNumber` varchar(20) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `firstName`, `lastName`, `username`, `password`, `email`, `contactNumber`, `createdAt`) VALUES
(1, 'John Jester', 'Alcantara', 'qwerte11', 'Alcantara11', 'adjest376@gmail.com', '09669749280', '2026-11-23 23:08:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`bookID`),
  ADD KEY `eventID` (`eventID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`eventID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `bookID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `eventID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `update_event_status` ON SCHEDULE EVERY 1 MINUTE STARTS '2026-11-21 13:42:00' ON COMPLETION NOT PRESERVE ENABLE DO UPDATE events
SET
    currentStatus = CASE
        WHEN NOW() >= endTime THEN 'Ended'
        WHEN NOW() >= startTime THEN 'Ongoing'
        ELSE 'Upcoming'
    END,
    updatedAt = NOW()
WHERE currentStatus != 'Cancelled'$$
SET GLOBAL event_scheduler="ON";
DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
