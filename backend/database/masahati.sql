-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 29, 2026 at 12:00 PM
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
(5, 19, 2, '2026-06-14 02:12:20'),
(73, 18, 3, '2026-06-14 15:48:36'),
(75, 20, 3, '2026-06-28 08:04:45'),
(77, 20, 1, '2026-06-29 08:17:58'),
(78, 20, 6, '2026-06-29 08:17:59'),
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
(5, 19, 2, 5, '100', '2026-06-14 02:13:07'),
(7, 19, 1, 4, 'good', '2026-06-14 02:34:58'),
(8, 18, 3, 5, 'Amazing place! Quiet, clean, and the internet is super fast. Perfect for focusing on work.', '2026-06-14 02:39:20'),
(9, 18, 2, 4, 'good', '2026-06-14 02:40:04'),
(10, 18, 1, 5, 'Amazing place! Quiet, clean, and the internet is super fast. Perfect for focusing on work.', '2026-06-14 02:40:19'),
(11, 20, 2, 4, 'WOW', '2026-06-28 08:06:16'),
(13, 21, 3, 4, 'Perfect for focusing on work.', '2026-06-29 08:43:05');

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
(20, 'Waed :)', 'waed70013@gmail.com', '$2y$10$tlxC5kQO7OMBCpM4Dnr33.tKjnKCIY.oexF0JaDAd79Qm7IshCDW2', 'user', 'user_20_1782719855.jpeg', '2026-06-28 08:03:52', '2026-06-29 08:07:53'),
(21, 'alaa ahmed', 'alaaahmed@gmail.com', '$2y$10$o8tNXvzWBPcfPwRQyvSMgOiwRAViUcfUey9tD4fcbfNgkns6uG/Me', 'user', 'avatar.png', '2026-06-29 08:41:53', '2026-06-29 08:41:53'),
(22, 'محمد طارق', 'tarq013@gmail.com', '$2y$10$YqRv1wfYVPeopGi14fqvAO7ficr2BqAtxsy3IC0s/hU6wJElkybKS', 'user', 'avatar.png', '2026-06-29 09:19:32', '2026-06-29 09:19:32'),
(23, 'محمد طارق', 'ttttttssss3@gmail.com', '$2y$10$g.IAKrehCANUNY8Xq.aWLOPbUQPffsHzFQFag8bA7hVWU4ZuwqcCG', 'user', 'avatar.png', '2026-06-29 09:20:09', '2026-06-29 09:20:09');

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
(1, 16, 'Focus Hub', 'A modern coworking space for productivity', 'North', 'Al-Rimal', 'Fast', '24/7', 30, '08:00:00', '22:00:00', 'quiet', 0, 5.00, '970599123456', 0.00, 'approved', '2026-06-03 06:32:29', '2026-06-03 06:23:29'),
(2, 16, 'Creative Hub', 'A modern coworking space for productivity', 'North', 'Sheikh Radwan', 'Very Fast', 'Available', 30, '08:00:00', '22:00:00', 'normal', 0, 10.00, '970599123456', 0.00, 'approved', '2026-06-03 06:32:29', '2026-06-03 06:31:38'),
(3, 16, 'Study Corner', 'A modern coworking space for productivity', 'North', 'Tal Al-Hawa', 'Fast', 'Available', 30, '08:00:00', '22:00:00', 'very_quiet', 1, 7.00, '970599123456', 0.00, 'approved', '2026-06-03 06:32:29', '2026-06-03 06:31:57'),
(4, 16, 'Tech Spot', 'A modern coworking space for productivity', 'North', 'Tal Al-Hawa', 'Good', 'Available', 30, '08:00:00', '22:00:00', 'normal', 1, 8.00, '970599123456', 0.00, 'approved', '2026-06-03 06:32:29', '2026-06-03 06:32:14'),
(5, 16, 'OpenGrid', 'A modern coworking space for productivity', 'North', 'Al-Rimal', 'Fast', '24/7', 30, '08:00:00', '22:00:00', 'quiet', 0, 5.00, '970599123456', 0.00, 'approved', '2026-06-03 06:32:29', '2026-06-14 15:09:01'),
(6, 16, 'Spark Station', 'A modern coworking space for productivity', 'North', 'Sheikh Radwan', 'Very Fast', 'Available', 30, '08:00:00', '22:00:00', 'normal', 0, 10.00, '970599123456', 0.00, 'approved', '2026-06-03 06:32:29', '2026-06-14 15:09:01'),
(7, 16, 'Grid Hub', 'A modern coworking space for productivity', 'North', 'Tal Al-Hawa', 'Fast', 'Available', 30, '08:00:00', '22:00:00', 'very_quiet', 1, 7.00, '970599123456', 0.00, 'approved', '2026-06-03 06:32:29', '2026-06-14 15:09:01'),
(8, 16, 'Nexus Hub', 'A modern coworking space for productivity', 'North', 'Tal Al-Hawa', 'Good', 'Available', 30, '08:00:00', '22:00:00', 'normal', 1, 8.00, '970599123456', 0.00, 'approved', '2026-06-03 06:32:29', '2026-06-14 15:09:01');

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
(11, 1, '1780468118_0.jpeg', '2026-06-03 06:28:38'),
(12, 1, '1780468118_1.jpeg', '2026-06-03 06:28:38'),
(13, 1, '1780468118_2.jpeg', '2026-06-03 06:28:38'),
(14, 1, '1780468118_3.jpeg', '2026-06-03 06:28:38'),
(15, 1, '1780468118_4.jpeg', '2026-06-03 06:28:38'),
(16, 2, '1780468298_0.jpeg', '2026-06-03 06:31:38'),
(17, 2, '1780468298_1.jpeg', '2026-06-03 06:31:38'),
(18, 2, '1780468298_2.jpeg', '2026-06-03 06:31:38'),
(19, 2, '1780468298_3.jpeg', '2026-06-03 06:31:38'),
(20, 2, '1780468298_4.jpeg', '2026-06-03 06:31:38'),
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
(31, 5, '1780468118_0.jpeg', '2026-06-14 15:11:32'),
(32, 5, '1780468118_1.jpeg', '2026-06-14 15:11:32'),
(33, 5, '1780468118_2.jpeg', '2026-06-14 15:11:32'),
(34, 5, '1780468118_3.jpeg', '2026-06-14 15:11:32'),
(35, 5, '1780468118_4.jpeg', '2026-06-14 15:11:32'),
(36, 6, '1780468298_0.jpeg', '2026-06-14 15:11:32'),
(37, 6, '1780468298_1.jpeg', '2026-06-14 15:11:32'),
(38, 6, '1780468298_2.jpeg', '2026-06-14 15:11:32'),
(39, 6, '1780468298_3.jpeg', '2026-06-14 15:11:32'),
(40, 6, '1780468298_4.jpeg', '2026-06-14 15:11:32'),
(41, 7, '1780468317_0.jpeg', '2026-06-14 15:11:32'),
(42, 7, '1780468317_1.jpeg', '2026-06-14 15:11:32'),
(43, 7, '1780468317_2.jpeg', '2026-06-14 15:11:32'),
(44, 7, '1780468317_3.jpeg', '2026-06-14 15:11:32'),
(45, 7, '1780468317_4.jpeg', '2026-06-14 15:11:32'),
(46, 8, '1780468334_0.jpeg', '2026-06-14 15:11:32'),
(47, 8, '1780468335_1.jpeg', '2026-06-14 15:11:32'),
(48, 8, '1780468335_2.jpeg', '2026-06-14 15:11:32'),
(49, 8, '1780468335_3.jpeg', '2026-06-14 15:11:32'),
(50, 8, '1780468335_4.jpeg', '2026-06-14 15:11:32');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `workspaces`
--
ALTER TABLE `workspaces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `workspace_images`
--
ALTER TABLE `workspace_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

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
