-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 02, 2026 at 01:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `masahati`
--

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `workspace_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `workspace_id`, `created_at`) VALUES
(3, 19, 3, '2026-06-14 02:06:35'),
(4, 19, 4, '2026-06-14 02:11:59'),
(73, 18, 3, '2026-06-14 15:48:36'),
(75, 20, 3, '2026-06-28 08:04:45'),
(79, 21, 7, '2026-06-29 08:43:18');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `workspace_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `workspace_id`, `rating`, `comment`, `created_at`) VALUES
(1, 18, 4, 4, 'best place', '2026-06-14 02:02:43'),
(3, 19, 4, 5, '100%', '2026-06-14 02:06:00'),
(8, 18, 3, 5, 'Amazing place! Quiet, clean, and the internet is super fast. Perfect for focusing on work.', '2026-06-14 02:39:20'),
(13, 21, 3, 4, 'Perfect for focusing on work.', '2026-06-29 08:43:05'),
(20, 26, 17, 5, 'Great place to focus and get work done', '2026-07-02 10:58:32'),
(21, 26, 22, 5, 'Quiet and comfortable environment.', '2026-07-02 10:58:52'),
(22, 26, 25, 5, 'Perfect for students and freelancers', '2026-07-02 10:59:10'),
(23, 26, 28, 5, 'Very helpful for staying focused.', '2026-07-02 10:59:22'),
(24, 26, 18, 5, 'Good lighting and comfortable seating.', '2026-07-02 10:59:35'),
(25, 26, 29, 5, 'Calm environment with everything you need.', '2026-07-02 10:59:46'),
(26, 26, 27, 5, 'Clean and well-organized space.', '2026-07-02 11:00:11'),
(27, 26, 24, 4, 'One of the best coworking spaces in the area.', '2026-07-02 11:00:24'),
(28, 26, 23, 5, 'Highly recommended for remote work.', '2026-07-02 11:00:57'),
(29, 26, 16, 4, 'Perfect for students and freelancers.', '2026-07-02 11:01:11'),
(30, 26, 19, 4, 'Ideal for productivity and meetings.', '2026-07-02 11:01:27'),
(31, 26, 7, 4, 'Fast internet and reliable setup.', '2026-07-02 11:01:48'),
(32, 26, 30, 4, 'Great for work', '2026-07-02 11:02:50'),
(33, 26, 21, 4, 'Great workspace', '2026-07-02 11:03:23'),
(34, 26, 20, 4, 'Highly recommended', '2026-07-02 11:03:34'),
(35, 26, 26, 4, 'Great for work', '2026-07-02 11:03:43');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','owner','admin') NOT NULL DEFAULT 'user',
  `avatar` varchar(255) DEFAULT 'avatar.png',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `created_at`, `updated_at`) VALUES
(1, 'Ali', 'ali@test.com', '$2y$10$nuWhyn6MsIInUVEBLdz9kuo3e50f3S2ZhlF7pidW6mHkwy9Ujyuxi', 'user', 'avatar.png', '2026-05-19 09:08:19', '2026-05-19 09:08:19'),
(2, 'Omar', 'owner@test.com', '$2y$10$09WCz3WboS3J6r89mcVJg.bHmi8CoEJcHqytE1cbQBBXQElase3EK', 'owner', '6a0c34da325dd.png', '2026-05-19 09:44:30', '2026-05-19 10:00:58'),
(3, 'Admin User', 'admin@test.com', '$2y$10$RXOd37Yo7SSws1AcFXRy9.KtS5GQGc4KpjY5aS/wLzdC6O0mL2ZuK', 'admin', 'avatar.png', '2026-05-19 12:25:39', '2026-05-19 12:26:13'),
(4, 'Waed Ahmed', 'waedalsoufi@gmail.com', '$2y$10$g26nfpb0t0m75ScjCvLnROI2fjT8RRFutKCePinpmXqQnKCPssCo6', 'user', 'avatar.png', '2026-05-25 17:01:54', '2026-05-25 17:01:54'),
(5, 'Waed Test User', 'waed.test@example.com', '$2y$10$xmff85nnunY1PUlFP7fgSeTr3Ntv9yOHwZ/SH67G/u7BnyU.Oor0W', 'user', 'avatar.png', '2026-06-01 12:58:42', '2026-06-01 12:58:42'),
(6, 'Ali Ahmed', 'ali.ahmed123@example.com', '$2y$10$1whPIKp1Cpj4BKTGOM/W9OrYtXPpMFTPIfE4hRC8FaByWCuhDZ8Cm', 'user', 'avatar.png', '2026-06-01 13:01:53', '2026-06-01 13:01:53'),
(7, 'Test Success User', 'success.test001@example.com', '$2y$10$3xfhAX4o8FBpLilsctfRB.0tatKH1tCn98Ibepzw.nR.KXcnb7fem', 'user', 'avatar.png', '2026-06-01 13:07:00', '2026-06-01 13:07:00'),
(8, 'Test Success User', 'suc22cess.test001@example.com', '$2y$10$hu21XKT7hjCpOGFZ9n9o2.wuz8mrH0LbaWhpws.4aebHLbiML4Fj.', 'user', 'avatar.png', '2026-06-01 13:08:03', '2026-06-01 13:08:03'),
(9, 'Mohammad Ali', 'mohammad.ali.test2026@example.com', '$2y$10$HUbklfWgEM.VVNox2F4h.OEqW.Fb6qIcIKjb5glJa0vXJmFj0Q1Ia', 'user', 'avatar.png', '2026-06-01 13:08:58', '2026-06-01 13:08:58'),
(10, 'Test User Two', 'test.user.two2026@example.com', '$2y$10$dXrP7W6rTZHgzLN8BVHVs.C3wIJEttpgDsTWJlobno1O9hqlCzhXu', 'user', 'avatar.png', '2026-06-01 13:17:06', '2026-06-01 13:17:06'),
(12, 'Ahmad  ', 'ahmad.test@gmail.com', '$2y$10$kojZ9Tfx/TDW2j0wrqx3leXujluRi/3HZL2t3.pAIsB2ic90TBTne', 'user', 'user_12_1780323986.png', '2026-06-01 13:47:08', '2026-06-01 14:26:26'),
(13, 'MOH ', 'tarq70013@gmail.com', '$2y$10$bGsxmvNbYHkngrwaxrgY5uLUnOMTZSDRmdFFoQLyEJewFyMINB/6K', 'user', 'user_13_1780330964.png', '2026-06-01 14:46:56', '2026-06-01 16:23:56'),
(14, 'Waed Test', 'waed@test.com', '$2y$10$MKqe1ibAbGPyPBfWwzblge9SbjGRlAyDOYbCOS29XTiceHhb9zzEu', 'user', 'avatar.png', '2026-06-02 18:44:17', '2026-06-02 18:44:17'),
(16, 'Workspace Owner', 'owner2@test.com', '$2y$10$HfpsjG6mGrlRr3AtpGPo3OXulHbwMC3k/uzSp4L5iqo7xB4Ua0DoW', 'owner', 'avatar.png', '2026-06-03 05:48:33', '2026-06-03 05:48:33'),
(17, 'Waed Alsoufi', 'waed.alsoufi@gmail.com', '$2y$10$LM9VR/x/x7vUncTm1cXaJOCaat5dfZssEEHXIs8RIxuCoqcoGVPVu', 'user', 'avatar.png', '2026-06-03 14:05:17', '2026-06-03 14:05:17'),
(18, 'alaa', 'alaa70013@gmail.com', '$2y$10$vb3cKj9yFGwPOGG7Yjsm3.48THvEcjab/Obz9dt.e5ssHng/jAcX6', 'user', 'avatar.png', '2026-06-12 10:18:37', '2026-06-12 10:18:37'),
(19, 'WAED', 'waed43@gmail.com', '$2y$10$PhrgYUrjCl9MtUdhJIG7EetjMyK9okBarfp4/.5bFTwWvUM94nBEm', 'user', 'avatar.png', '2026-06-14 02:05:07', '2026-06-14 02:05:07'),
(20, 'Waed :)', 'waed70013@gmail.com', '$2y$10$tlxC5kQO7OMBCpM4Dnr33.tKjnKCIY.oexF0JaDAd79Qm7IshCDW2', 'admin', 'user_20_1782719855.jpeg', '2026-06-28 08:03:52', '2026-07-01 10:04:57'),
(21, 'alaa ahmed', 'alaaahmed@gmail.com', '$2y$10$o8tNXvzWBPcfPwRQyvSMgOiwRAViUcfUey9tD4fcbfNgkns6uG/Me', 'user', 'avatar.png', '2026-06-29 08:41:53', '2026-06-29 08:41:53'),
(22, 'محمد طارق', 'tarq013@gmail.com', '$2y$10$YqRv1wfYVPeopGi14fqvAO7ficr2BqAtxsy3IC0s/hU6wJElkybKS', 'user', 'avatar.png', '2026-06-29 09:19:32', '2026-06-29 09:19:32'),
(23, 'محمد طارق', 'ttttttssss3@gmail.com', '$2y$10$g.IAKrehCANUNY8Xq.aWLOPbUQPffsHzFQFag8bA7hVWU4ZuwqcCG', 'user', 'avatar.png', '2026-06-29 09:20:09', '2026-06-29 09:20:09'),
(24, 'owner', 'owner70013@gmail.com', '$2y$10$1Oz9VhaxqgiPXZ9i5CeVoemgagVryxUWwytOe6XfE6i2uXnRC0LtS', 'owner', 'avatar.png', '2026-06-30 11:20:36', '2026-06-30 11:20:36'),
(25, 'Owner', 'nour70013@gmail.com', '$2y$10$3gXKs9OJGVEpt8nfbV9l2esNj5ZhvS4NYRYl4hmU8VbCF2eU6MWbW', 'owner', 'avatar.png', '2026-07-01 00:17:24', '2026-07-02 09:22:02'),
(26, 'Alaa', 'alaa_ahmed@gmail.com', '$2y$10$nOzlpCA5ybDwDfqncNeVnuCmF.3LG.2obISJZKGJWedg1wGW0G7Pm', 'user', 'avatar.png', '2026-07-02 10:58:05', '2026-07-02 10:58:05');

-- --------------------------------------------------------

--
-- Table structure for table `workspaces`
--

CREATE TABLE `workspaces` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `workspace_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `area` varchar(100) NOT NULL,
  `internet_quality` enum('Very Fast','Fast','Good') DEFAULT NULL,
  `electricity_status` enum('Available','24/7','Backup Available') DEFAULT NULL,
  `seating` int(11) DEFAULT NULL,
  `hours_from` time DEFAULT NULL,
  `hours_to` time DEFAULT NULL,
  `quietness_level` enum('very_quiet','quiet','normal') DEFAULT NULL,
  `ladies_area` tinyint(1) DEFAULT 0,
  `price_per_hour` decimal(10,2) DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `avg_rating` decimal(3,2) DEFAULT 0.00,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workspaces`
--

INSERT INTO `workspaces` (`id`, `owner_id`, `workspace_name`, `description`, `city`, `area`, `internet_quality`, `electricity_status`, `seating`, `hours_from`, `hours_to`, `quietness_level`, `ladies_area`, `price_per_hour`, `whatsapp`, `avg_rating`, `status`, `approved_at`, `created_at`) VALUES
(3, 25, 'Study Corner', 'A modern coworking space for productivity', 'North', 'Tal Al-Hawa', 'Fast', 'Available', 30, '08:00:00', '22:00:00', 'very_quiet', 1, 7.00, '970599123456', 0.00, 'pending', '2026-06-03 06:32:29', '2026-06-03 06:31:57'),
(4, 25, 'Tech Spot', 'A modern coworking space for productivity', 'North', 'Tal Al-Hawa', 'Good', 'Available', 30, '08:00:00', '22:00:00', 'normal', 1, 8.00, '970599123456', 0.00, 'approved', '2026-06-03 06:32:29', '2026-06-03 06:32:14'),
(7, 25, 'Grid Hub', 'A modern coworking space for productivity', 'North', 'Tal Al-Hawa', 'Fast', 'Available', 30, '08:00:00', '22:00:00', 'very_quiet', 1, 7.00, '970599123456', 0.00, 'approved', '2026-06-03 06:32:29', '2026-06-14 15:09:01'),
(8, 25, 'Nexus Hub', 'A modern coworking space for productivity', 'North', 'Tal Al-Hawa', 'Good', 'Available', 30, '08:00:00', '22:00:00', 'normal', 1, 8.00, '970599123456', 0.00, 'pending', '2026-06-03 06:32:29', '2026-06-14 15:09:01'),
(16, 25, 'Sultan Hub', 'The Perfect Workspace for Freelancers & University Students\r\nEnjoy a quiet, comfortable, and fully air-conditioned workspace designed for focus and productivity, with high-speed fiber internet and continuous electricity throughout the day.\r\nLocation: Al-Nas Street, next to Sultan Water Desalination Compan', 'South', 'Mawasi Khan Younis', 'Fast', 'Available', 30, '08:00:00', '23:00:00', 'quiet', 0, 5.00, '+972593303041', 0.00, 'approved', NULL, '2026-07-02 08:58:37'),
(17, 25, 'Awtar Tech', 'Awtar Hub is a comfortable workspace for freelancers and university students, offering reliable internet, continuous electricity, and comfortable desks and seating in a productive environment.\r\n\r\nLocation: Behind Al-Attar Station, next to the UNRWA Clinic', 'South', 'Mawasi Khan Younis', 'Good', 'Available', 20, '08:00:00', '18:00:00', 'quiet', 0, 5.00, '+972599637448', 0.00, 'approved', NULL, '2026-07-02 09:03:44'),
(18, 25, 'Al-Jawhara Cafe', '☕ Al-Jawhara Café\r\n💻 Workspaces equipped for study and remote work \r\n📶 High-speed internet and a quiet atmosphere \r\n🍰 Desserts, as well as hot and cold drinks \r\n📍 Middle of Al-Bahr Street – next to Karim Center', 'South', 'Mawasi Khan Younis', 'Very Fast', '24/7', 80, '09:00:00', '23:00:00', 'normal', 1, 5.00, '+972599478579', 0.00, 'approved', NULL, '2026-07-02 09:08:25'),
(19, 25, 'Rokon Space', 'Rokon Space offers a productive and comfortable workspace for freelancers and students, with reliable electricity, high-speed internet, and a professional working environment.\r\n\r\nLocation: Al-Saraya, next to Jawwal Company, Al-Rahab Mall, First Floor.', 'North', 'Al-Rimal', 'Very Fast', 'Available', 100, '09:00:00', '20:00:00', 'very_quiet', 1, 5.00, '+972595880890', 0.00, 'approved', NULL, '2026-07-02 09:21:28'),
(20, 25, 'Al-Sahel Cafe', 'A modern workspace offering quiet work areas, high-speed internet, and 24/7 electricity in a comfortable environment for freelancers and students.\r\nLocation: Al-Nas Street, next to Orabi Laptop.', 'South', 'Mawasi Khan Younis', 'Fast', '24/7', 30, '08:00:00', '12:00:00', 'normal', 0, 3.00, '+9725977713203', 0.00, 'approved', NULL, '2026-07-02 09:28:49'),
(21, 25, 'Madar Tech', 'Your first space for creativity.\r\nVIP fiber internet | hands-on training | fully integrated professional environment.\r\nLocation: Al-Khair Hospital area, near the Sharia Court.', 'South', 'Mawasi Khan Younis', 'Good', 'Available', 25, '09:00:00', '18:00:00', 'normal', 0, 4.00, '+9725977713203', 0.00, 'approved', NULL, '2026-07-02 09:39:50'),
(22, 25, 'Masar Tech', 'A perfect student space for focus and productivity, combining creativity and efficiency.\r\n\r\nLocation: North of Al-Nas Junction, opposite Al-Qrnawi Supermarket.', 'South', 'Mawasi Khan Younis', 'Good', 'Available', 25, '08:00:00', '22:00:00', 'normal', 1, 4.00, '+972597060870', 0.00, 'approved', NULL, '2026-07-02 09:43:34'),
(23, 25, 'Meras Space', 'A community and productive environment for students, freelancers, and trainers. A hub for free practical training and hands-on experience.\r\nLocation: Nuseirat', 'Center', 'Nuseirat', 'Fast', 'Available', 20, '09:00:00', '22:00:00', 'normal', 1, 5.00, '+972598700396', 0.00, 'approved', NULL, '2026-07-02 09:50:40'),
(24, 25, 'Zero to Hero Hub', '📍 Nuseirat – Midway along Saq Allah Street, opposite Hamada Ice Cream, a workspace and study environment offering online and in-person diplomas, university field training, and digital services including design and programming.', 'Center', 'Nuseirat', 'Good', 'Available', 25, '09:00:00', '21:00:00', 'normal', 0, 3.00, '+972597676123', 0.00, 'approved', NULL, '2026-07-02 09:54:05'),
(25, 25, 'Garden Space', 'A comfortable and professional workspace with continuous electricity and high-speed internet.\r\n\r\nOmar Al-Mukhtar Street – opposite Al-Baladiya Park, Gaza City', 'North', 'Al-Saraya', 'Good', 'Available', 25, '08:30:00', '20:30:00', 'normal', 0, 4.00, '+972598287166', 0.00, 'approved', NULL, '2026-07-02 09:58:24'),
(26, 25, 'Grow Space', 'A fully integrated space for study, work, and training.\r\n\r\nHigh-speed fiber internet, stable electricity, and a dedicated section for women.\r\n\r\nWest of Ramzon Al-Maghazi Store, Al-Noor Building, 2nd Floor.', 'North', 'Salah Al-Din Street', 'Very Fast', 'Available', 25, '09:00:00', '23:00:00', 'normal', 0, 4.00, '+972592898306', 0.00, 'approved', NULL, '2026-07-02 10:13:46'),
(27, 25, 'Babel Space', 'Success needs the right place.\r\n\r\n24/7 electricity and internet, with individual seating options and flexible daily/monthly plans.\r\n\r\nAl-Wahda Street, next to Al-Shifa Hospital, Al-Barzono Building, 1st Floor, opposite Gaza Diagnostic Center.', 'North', 'Al-Rimal', 'Fast', 'Available', 25, '08:00:00', '18:30:00', 'normal', 0, 3.00, '+972595255792', 0.00, 'approved', NULL, '2026-07-02 10:16:37'),
(28, 25, 'GoWork Hub', 'Work, learn, and launch your ideas. 🚀\r\nFrom individual work to team collaboration – fully equipped rooms for every need.', 'North', 'Al-Rimal', 'Very Fast', '24/7', 100, '09:00:00', '19:00:00', 'normal', 1, 5.00, '+972566977777', 0.00, 'approved', NULL, '2026-07-02 10:26:20'),
(29, 25, 'Elevate Hub', 'Elevate Hub is a shared workspace that provides a comfortable and motivating environment to help you achieve your goals and develop your passion, whether you are a student, freelancer, entrepreneur, or someone working on their ideas.\r\n\r\nLocation: Nuseirat – North of Al-Zohour Junction, 50 meters (1st floor, former Jeva Center site).\r\nPayment: Available via banking app.', 'Center', 'Nuseirat', 'Fast', 'Available', 50, '09:00:00', '21:00:00', 'normal', 1, 5.00, '+972592878290', 0.00, 'approved', NULL, '2026-07-02 10:41:07'),
(30, 25, 'C2', 'A workspace and cafe offering a comfortable environment for focus and productivity at 5 NIS per hour, with high-speed internet, charging, and drinks. Includes individual desks, meeting rooms, and training rooms in one place.\r\n\r\nLocation: Nuseirat – next to Abu Zaytoun.', 'Center', 'Nuseirat', 'Fast', 'Available', 60, '09:00:00', '21:00:00', 'normal', 1, 5.00, '+972593099240', 0.00, 'approved', NULL, '2026-07-02 10:43:12');

-- --------------------------------------------------------

--
-- Table structure for table `workspace_images`
--

CREATE TABLE `workspace_images` (
  `id` int(11) NOT NULL,
  `workspace_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workspace_images`
--

INSERT INTO `workspace_images` (`id`, `workspace_id`, `image_path`, `created_at`) VALUES
(21, 3, '1780468317_0.jpeg', '2026-06-03 06:31:57'),
(22, 3, '1780468317_1.jpeg', '2026-06-03 06:31:57'),
(23, 3, '1780468317_2.jpeg', '2026-06-03 06:31:57'),
(24, 3, '1780468317_3.jpeg', '2026-06-03 06:31:57'),
(25, 3, '1780468317_4.jpeg', '2026-06-03 06:31:57'),
(26, 4, '1780468334_0.jpeg', '2026-06-03 06:32:14'),
(27, 4, '1780468335_1.jpeg', '2026-06-03 06:32:15'),
(28, 4, '1780468335_2.jpeg', '2026-06-03 06:32:15'),
(29, 4, '1780468335_3.jpeg', '2026-06-03 06:32:15'),
(30, 4, '1780468335_4.jpeg', '2026-06-03 06:32:15'),
(41, 7, '1780468317_0.jpeg', '2026-06-14 15:11:32'),
(42, 7, '1780468317_1.jpeg', '2026-06-14 15:11:32'),
(43, 7, '1780468317_2.jpeg', '2026-06-14 15:11:32'),
(44, 7, '1780468317_3.jpeg', '2026-06-14 15:11:32'),
(45, 7, '1780468317_4.jpeg', '2026-06-14 15:11:32'),
(46, 8, '1780468334_0.jpeg', '2026-06-14 15:11:32'),
(47, 8, '1780468335_1.jpeg', '2026-06-14 15:11:32'),
(48, 8, '1780468335_2.jpeg', '2026-06-14 15:11:32'),
(49, 8, '1780468335_3.jpeg', '2026-06-14 15:11:32'),
(50, 8, '1780468335_4.jpeg', '2026-06-14 15:11:32'),
(71, 16, '1782982717_0.jpeg', '2026-07-02 08:58:37'),
(72, 16, '1782982721_1.jpeg', '2026-07-02 08:58:41'),
(73, 16, '1782982722_2.jpeg', '2026-07-02 08:58:42'),
(74, 16, '1782982723_3.jpeg', '2026-07-02 08:58:43'),
(75, 16, '1782982723_4.jpeg', '2026-07-02 08:58:43'),
(76, 17, '1782983025_0.jpeg', '2026-07-02 09:03:45'),
(77, 17, '1782983025_1.jpeg', '2026-07-02 09:03:45'),
(78, 17, '1782983025_2.jpeg', '2026-07-02 09:03:45'),
(79, 17, '1782983025_3.jpeg', '2026-07-02 09:03:45'),
(80, 18, '1782983305_0.jpeg', '2026-07-02 09:08:25'),
(81, 18, '1782983305_1.jpeg', '2026-07-02 09:08:25'),
(82, 18, '1782983305_2.jpeg', '2026-07-02 09:08:25'),
(83, 18, '1782983305_3.jpeg', '2026-07-02 09:08:25'),
(84, 18, '1782983305_4.jpeg', '2026-07-02 09:08:25'),
(85, 19, '1782984090_0.jpeg', '2026-07-02 09:21:30'),
(86, 19, '1782984090_1.jpeg', '2026-07-02 09:21:30'),
(87, 19, '1782984090_2.jpeg', '2026-07-02 09:21:30'),
(88, 19, '1782984090_3.jpeg', '2026-07-02 09:21:30'),
(89, 19, '1782984090_4.jpeg', '2026-07-02 09:21:30'),
(90, 20, '1782984529_0.jpeg', '2026-07-02 09:28:49'),
(91, 20, '1782984529_1.jpeg', '2026-07-02 09:28:49'),
(92, 20, '1782984530_2.jpeg', '2026-07-02 09:28:50'),
(93, 20, '1782984530_3.jpeg', '2026-07-02 09:28:50'),
(94, 20, '1782984532_4.jpeg', '2026-07-02 09:28:52'),
(95, 21, '1782985190_0.jpeg', '2026-07-02 09:39:50'),
(96, 21, '1782985191_1.jpeg', '2026-07-02 09:39:51'),
(97, 21, '1782985191_2.jpeg', '2026-07-02 09:39:51'),
(98, 21, '1782985191_3.jpeg', '2026-07-02 09:39:51'),
(99, 21, '1782985191_4.jpeg', '2026-07-02 09:39:51'),
(100, 22, '1782985414_0.jpg', '2026-07-02 09:43:34'),
(101, 22, '1782985414_1.jpg', '2026-07-02 09:43:34'),
(102, 22, '1782985414_2.jpg', '2026-07-02 09:43:34'),
(103, 22, '1782985414_3.jpg', '2026-07-02 09:43:34'),
(104, 22, '1782985414_4.jpg', '2026-07-02 09:43:34'),
(105, 23, '1782985840_0.jpeg', '2026-07-02 09:50:40'),
(106, 23, '1782985840_1.jpeg', '2026-07-02 09:50:40'),
(107, 23, '1782985840_2.jpeg', '2026-07-02 09:50:40'),
(108, 23, '1782985840_3.jpeg', '2026-07-02 09:50:40'),
(109, 23, '1782985840_4.jpeg', '2026-07-02 09:50:40'),
(110, 24, '1782986045_0.jpeg', '2026-07-02 09:54:05'),
(111, 24, '1782986046_1.jpeg', '2026-07-02 09:54:06'),
(112, 24, '1782986047_2.jpeg', '2026-07-02 09:54:07'),
(113, 24, '1782986047_3.jpeg', '2026-07-02 09:54:07'),
(114, 24, '1782986047_4.jpeg', '2026-07-02 09:54:07'),
(115, 25, '1782986304_0.jpeg', '2026-07-02 09:58:24'),
(116, 25, '1782986304_1.jpeg', '2026-07-02 09:58:24'),
(117, 25, '1782986304_2.jpeg', '2026-07-02 09:58:24'),
(118, 25, '1782986304_3.jpeg', '2026-07-02 09:58:24'),
(119, 25, '1782986304_4.jpeg', '2026-07-02 09:58:24'),
(120, 26, '1782987226_0.jpeg', '2026-07-02 10:13:46'),
(121, 26, '1782987226_1.jpeg', '2026-07-02 10:13:46'),
(122, 26, '1782987226_2.jpeg', '2026-07-02 10:13:46'),
(123, 26, '1782987226_3.jpeg', '2026-07-02 10:13:46'),
(124, 26, '1782987227_4.jpeg', '2026-07-02 10:13:47'),
(132, 27, '1782987588_0.jpeg', '2026-07-02 10:19:49'),
(133, 27, '1782987589_1.jpeg', '2026-07-02 10:19:49'),
(134, 27, '1782987589_2.jpeg', '2026-07-02 10:19:49'),
(135, 27, '1782987590_3.jpeg', '2026-07-02 10:19:50'),
(136, 27, '1782987590_4.jpeg', '2026-07-02 10:19:50'),
(137, 28, '1782987980_0.jpg', '2026-07-02 10:26:20'),
(138, 28, '1782987980_1.jpg', '2026-07-02 10:26:20'),
(139, 28, '1782987980_2.jpg', '2026-07-02 10:26:20'),
(140, 28, '1782987980_3.jpg', '2026-07-02 10:26:20'),
(141, 29, '1782988867_0.jpeg', '2026-07-02 10:41:07'),
(142, 29, '1782988867_1.jpeg', '2026-07-02 10:41:07'),
(143, 30, '1782988993_0.jpeg', '2026-07-02 10:43:13'),
(144, 30, '1782988993_1.jpeg', '2026-07-02 10:43:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_favorite` (`user_id`,`workspace_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_workspace` (`workspace_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_review` (`user_id`,`workspace_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_workspace` (`workspace_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `workspaces`
--
ALTER TABLE `workspaces`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_city` (`city`),
  ADD KEY `idx_area` (`area`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_price` (`price_per_hour`),
  ADD KEY `idx_owner` (`owner_id`);

--
-- Indexes for table `workspace_images`
--
ALTER TABLE `workspace_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_workspace_images_workspace` (`workspace_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `workspaces`
--
ALTER TABLE `workspaces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `workspace_images`
--
ALTER TABLE `workspace_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `workspaces`
--
ALTER TABLE `workspaces`
  ADD CONSTRAINT `workspaces_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `workspace_images`
--
ALTER TABLE `workspace_images`
  ADD CONSTRAINT `fk_workspace_images_workspace` FOREIGN KEY (`workspace_id`) REFERENCES `workspaces` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
