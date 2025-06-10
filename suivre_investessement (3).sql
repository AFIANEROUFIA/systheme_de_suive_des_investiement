-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 28 mai 2025 à 08:21
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `suivre_investessement`
--

-- --------------------------------------------------------

--
-- Structure de la table `electrification_observations`
--

CREATE TABLE `electrification_observations` (
  `id` int(11) NOT NULL,
  `projet_id` int(11) NOT NULL,
  `date_observation` date NOT NULL,
  `observation_text` text NOT NULL,
  `created_by` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `electrification_observations`
--

INSERT INTO `electrification_observations` (`id`, `projet_id`, `date_observation`, `observation_text`, `created_by`, `created_at`) VALUES
(4, 8, '2025-05-25', 'Retard causé par absence de matériaux', 1, '2025-05-25 22:34:16'),
(7, 8, '2025-05-25', 'Test Postman OK', 1, '2025-05-25 22:40:29');

-- --------------------------------------------------------

--
-- Structure de la table `modifications`
--

CREATE TABLE `modifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `table_modifiee` varchar(100) DEFAULT NULL,
  `id_enregistrement` int(11) DEFAULT NULL,
  `action` enum('ajout','modification','suppression') DEFAULT NULL,
  `date_action` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `modifications`
--

INSERT INTO `modifications` (`id`, `user_id`, `table_modifiee`, `id_enregistrement`, `action`, `date_action`) VALUES
(1, 1, 'projets_electrification', 1, 'ajout', '2024-05-01 10:15:22'),
(2, 1, 'projets_electrification', 2, 'ajout', '2024-04-08 14:30:45'),
(3, 2, 'projets_electrification', 3, 'ajout', '2024-03-06 09:45:12'),
(4, 2, 'projets_electrification', 4, 'ajout', '2024-02-21 11:20:33'),
(5, 1, 'projets_electrification', 5, 'ajout', '2024-01-16 15:10:27'),
(6, 1, 'projets_investissement', 1, 'ajout', '2024-01-11 08:45:19'),
(7, 1, 'projets_investissement', 2, 'ajout', '2024-02-06 10:30:42'),
(8, 2, 'projets_investissement', 3, 'ajout', '2024-03-02 13:15:56'),
(9, 2, 'projets_investissement', 4, 'ajout', '2024-04-15 09:20:38'),
(10, 1, 'projets_investissement', 5, 'ajout', '2024-01-16 14:05:27'),
(11, 1, 'projets_investissement', 2, 'modification', '2024-04-10 11:25:33'),
(12, 1, 'projets_electrification', 1, 'modification', '2024-05-02 16:40:12');

-- --------------------------------------------------------

--
-- Structure de la table `observations_investissement`
--

CREATE TABLE `observations_investissement` (
  `id` int(11) NOT NULL,
  `projet_id` int(11) NOT NULL,
  `date_observation` date NOT NULL,
  `observation_text` text NOT NULL,
  `created_by` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `projets_electrification`
--

CREATE TABLE `projets_electrification` (
  `id` int(11) NOT NULL,
  `intitule` varchar(255) NOT NULL,
  `code_projet` varchar(100) NOT NULL,
  `nature_juridique` varchar(100) NOT NULL,
  `localisation` varchar(255) DEFAULT NULL,
  `daira` varchar(100) NOT NULL,
  `commune` varchar(100) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `type_installation` varchar(100) NOT NULL,
  `description_technique` text DEFAULT NULL,
  `budget` decimal(15,2) NOT NULL DEFAULT 0.00,
  `entrepreneur` varchar(255) DEFAULT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'planned',
  `date_debut` date NOT NULL,
  `date_prevue_fin` date NOT NULL,
  `date_reception_demande` date DEFAULT NULL,
  `date_envoi_sonelgaz` date DEFAULT NULL,
  `date_accord_sonelgaz` date DEFAULT NULL,
  `observations` text DEFAULT NULL,
  `fichier_justificatif` varchar(255) DEFAULT NULL,
  `created_by` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `projets_electrification`
--

INSERT INTO `projets_electrification` (`id`, `intitule`, `code_projet`, `nature_juridique`, `localisation`, `daira`, `commune`, `adresse`, `type_installation`, `description_technique`, `budget`, `entrepreneur`, `statut`, `date_debut`, `date_prevue_fin`, `date_reception_demande`, `date_envoi_sonelgaz`, `date_accord_sonelgaz`, `observations`, `fichier_justificatif`, `created_by`, `created_at`, `updated_at`) VALUES
(8, 'Poste de transformation pour coopérative agricole', 'EL-2025-002', 'Privé', 'Coopérative des Agriculteurs', 'Bouchegouf', 'Bouchegouf', 'Zone industrielle Est', 'poste_transformation', 'Installation poste 250 KVA pour irrigation collective', 4500000.00, 'EURL Electra Guelma', 'in-progress', '2025-05-01', '2025-09-01', NULL, NULL, NULL, 'Projet prioritaire selon DSA', NULL, 1, '2025-05-25 19:25:07', '2025-05-25 19:25:07'),
(14, 'rofia', 'EL-2025-999', 'installation-lignes', 'Oued Zenati', 'guelma', 'guelma', 'Cité agricole', 'puits', 'Installation test', 1500000.00, 'SARL Lumière', 'planned', '2025-06-01', '2025-12-31', NULL, NULL, NULL, NULL, NULL, 1, '2025-05-26 21:17:14', '2025-05-27 19:34:22'),
(15, 'sdfghj', 'ELEC-2025-05-001', 'installation-lignes', '', 'hammam-debagh', 'hammam-debagh', '', 'forage', '', 20000000.00, 'roufiaelec', 'in-progress', '2025-05-05', '2025-05-29', '2025-05-01', '2025-05-03', '2025-05-04', NULL, NULL, 1, '2025-05-26 21:22:20', '2025-05-26 21:22:20'),
(16, 'sihem', 'ELEC-2025-05-002', 'installation-lignes', '', 'guelma', 'guelma', '', 'forage', NULL, 100000000.00, 'roufiaelec', 'in-progress', '2025-05-08', '2025-05-04', '2025-05-01', '2025-05-02', '2025-05-03', NULL, NULL, 1, '2025-05-26 21:36:10', '2025-05-26 21:53:14');

-- --------------------------------------------------------

--
-- Structure de la table `projets_investissement`
--

CREATE TABLE `projets_investissement` (
  `id` int(11) NOT NULL,
  `code_projet` varchar(100) DEFAULT NULL,
  `intitule` varchar(255) DEFAULT NULL,
  `localisation` varchar(255) DEFAULT NULL,
  `daira` varchar(100) DEFAULT NULL,
  `commune` varchar(100) DEFAULT NULL,
  `beneficiaire` varchar(255) DEFAULT NULL,
  `type_programme` enum('normale','urgence','psre','special','complémentaire','pcsc','hp','sud') DEFAULT NULL,
  `annee_budget` int(11) DEFAULT NULL,
  `budget_alloue` decimal(15,2) DEFAULT NULL,
  `montant_engage` decimal(15,2) DEFAULT NULL,
  `montant_payee` decimal(15,2) DEFAULT NULL,
  `etat_avancement` tinyint(4) DEFAULT NULL,
  `entreprise` varchar(255) DEFAULT NULL,
  `situation` enum('planned','in-progress','completed') DEFAULT 'planned',
  `cause_non_lancement` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `date_prevue_fin` date DEFAULT NULL,
  `type_budget` enum('pcd','psd','psc') DEFAULT NULL,
  `numero_operation` varchar(100) DEFAULT NULL,
  `maitre_ouvrage` varchar(255) DEFAULT NULL,
  `fichier_justificatif` varchar(255) DEFAULT NULL,
  `penalite_retard` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `projets_investissement`
--

INSERT INTO `projets_investissement` (`id`, `code_projet`, `intitule`, `localisation`, `daira`, `commune`, `beneficiaire`, `type_programme`, `annee_budget`, `budget_alloue`, `montant_engage`, `montant_payee`, `etat_avancement`, `entreprise`, `situation`, `cause_non_lancement`, `description`, `date_debut`, `date_prevue_fin`, `type_budget`, `numero_operation`, `maitre_ouvrage`, `fichier_justificatif`, `penalite_retard`, `created_by`) VALUES
(2, 'INV-2024-002', 'Réhabilitation des canaux d\'irrigation', 'Bouchegouf', NULL, NULL, NULL, 'urgence', 2024, 28000000.00, 28000000.00, 22000000.00, 80, 'EURL Hydro-Travaux', '', NULL, NULL, '2024-02-05', '2024-05-15', 'pcd', 'OP-2024-1255', 'Direction des Services Agricoles', NULL, 0, 1),
(3, 'INV-2024-003', 'Aménagement des pistes agricoles', 'Oued Zenati', NULL, NULL, NULL, 'psre', 2024, 35000000.00, 32000000.00, 18000000.00, 45, 'EPE Travaux Publics', '', NULL, NULL, '2024-03-01', '2024-09-30', 'psc', 'OP-2024-1256', 'Direction des Services Agricoles', NULL, 0, 2),
(4, 'INV-2024-004', 'Construction d\'un centre de collecte de lait', 'Héliopolis', NULL, NULL, NULL, 'special', 2024, 22000000.00, 0.00, 0.00, 0, 'Non attribué', '', NULL, NULL, '2024-06-01', '2024-12-31', 'psd', 'OP-2024-1257', 'Direction des Services Agricoles', NULL, 0, 2),
(9, 'INV-2025-001', 'Projet Irrigation Ain Makhlouf', 'Ain Makhlouf', NULL, NULL, NULL, 'psre', 2025, 4500000.00, 2000000.00, 1500000.00, 35, 'SARL Eau Verte', '', '', NULL, '2025-06-01', '2025-12-30', 'pcd', 'OP-INV-2025-007', 'DSA Guelma', NULL, 0, 1),
(10, 'INV-2025-01-001', 'Exemple projet test', 'guelma', NULL, NULL, NULL, '', 2025, 1000000.00, 500000.00, 300000.00, 50, 'Entreprise Test', '', '', NULL, '2025-01-01', '2025-12-31', 'psc', 'INV-2025-01-001', 'DSA Guelma', NULL, 0, 1),
(11, 'INV-2025-01-005', 'roufia afiane ', 'guelma', NULL, NULL, NULL, '', 2025, 1000000.00, 500000.00, 300000.00, 50, 'Entreprise Test', '', '', NULL, '2025-01-01', '2025-12-31', 'psc', 'INV-2025-01-001', 'DSA Guelma', NULL, 0, 1),
(12, 'PROJ-2025-68369fe0bb9c2', 'Électrification Ferme A1', 'Guelma / Nechmaya', 'Guelma', 'Nechmaya', 'Mohamed B.', 'normale', 2024, 1500000.00, 500000.00, 300000.00, 20, NULL, 'planned', NULL, 'Projet de raccordement pour ferme laitière', '2024-06-01', '2024-12-01', NULL, NULL, NULL, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `last_login` datetime DEFAULT NULL,
  `last_modification` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `last_login`, `last_modification`, `created_at`) VALUES
(1, 'admin', 'admin@dsa-agriculture.dz', '$2y$10$abcdefghijklmnopqrstuuWVmDnVqQh3vSTRbsJZ.JHxLj5YvR5O', 'admin', '2025-05-05 12:32:56', NULL, '2025-05-05 12:32:56'),
(2, 'manager', 'manager@dsa-agriculture.dz', '$2y$10$abcdefghijklmnopqrstuuWVmDnVqQh3vSTRbsJZ.JHxLj5YvR5O', 'user', '2025-05-05 12:32:56', NULL, '2025-05-05 12:32:56'),
(3, 'technicien', 'tech@dsa-agriculture.dz', '$2y$10$abcdefghijklmnopqrstuuWVmDnVqQh3vSTRbsJZ.JHxLj5YvR5O', 'user', '2025-05-05 12:32:56', NULL, '2025-05-05 12:32:56');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `electrification_observations`
--
ALTER TABLE `electrification_observations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_obs_projet` (`projet_id`);

--
-- Index pour la table `modifications`
--
ALTER TABLE `modifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `observations_investissement`
--
ALTER TABLE `observations_investissement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projet_id` (`projet_id`);

--
-- Index pour la table `projets_electrification`
--
ALTER TABLE `projets_electrification`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `projets_investissement`
--
ALTER TABLE `projets_investissement`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code_projet` (`code_projet`),
  ADD KEY `created_by` (`created_by`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `electrification_observations`
--
ALTER TABLE `electrification_observations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `modifications`
--
ALTER TABLE `modifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `observations_investissement`
--
ALTER TABLE `observations_investissement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `projets_electrification`
--
ALTER TABLE `projets_electrification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `projets_investissement`
--
ALTER TABLE `projets_investissement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `electrification_observations`
--
ALTER TABLE `electrification_observations`
  ADD CONSTRAINT `fk_obs_projet` FOREIGN KEY (`projet_id`) REFERENCES `projets_electrification` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `modifications`
--
ALTER TABLE `modifications`
  ADD CONSTRAINT `modifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `observations_investissement`
--
ALTER TABLE `observations_investissement`
  ADD CONSTRAINT `observations_investissement_ibfk_1` FOREIGN KEY (`projet_id`) REFERENCES `projets_investissement` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `projets_investissement`
--
ALTER TABLE `projets_investissement`
  ADD CONSTRAINT `projets_investissement_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
