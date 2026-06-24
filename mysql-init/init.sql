-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Tempo de geração: 23/06/2026 às 03:40
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `site_realiza`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `contatos`
--

CREATE TABLE `contatos` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mensagem` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `contatos`
--

INSERT INTO `contatos` (`id`, `nome`, `email`, `mensagem`, `created_at`) VALUES
(4, 'Isabelly Lucas Koch ', 'isabellykoch@gmail.com', 'Duvidas no site ', '2026-04-16 12:07:51'),
(5, 'Isabelly Lucas Koch ', 'isabellykoch@gmail.com', 'duvidas sobre o produto ', '2026-04-16 12:13:44'),
(6, 'Isabelly Lucas Koch ', 'isabellykoch@gmail.com', 'como o produto funciona', '2026-04-16 12:14:25'),
(7, 'Isabelly Lucas Koch ', 'isabellykoch@gmail.com', 'duvidas produto e orçamento ', '2026-04-16 20:13:23'),
(8, 'Isabelly Lucas Koch ', 'isabellykoch@gmail.com', 'Entrar em contato com a empresa', '2026-04-16 20:18:58');

-- --------------------------------------------------------

--
-- Estrutura para tabela `orcamentos`
--

CREATE TABLE `orcamentos` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `empresa` varchar(100) DEFAULT NULL,
  `cnpj` varchar(18) DEFAULT NULL,
  `local` varchar(100) DEFAULT NULL,
  `equipamentos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`equipamentos`)),
  `quantidade_total_kg` decimal(10,2) DEFAULT NULL,
  `investimento_total` decimal(10,2) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `orcamentos`
--

INSERT INTO `orcamentos` (`id`, `user_id`, `nome`, `email`, `cpf`, `telefone`, `empresa`, `cnpj`, `local`, `equipamentos`, `quantidade_total_kg`, `investimento_total`, `status`, `created_at`) VALUES
(1, 1, 'Gabrielly Lucas', 'gaby@email.com', '52998224725', '(44)999999999', 'empresa realiza', '11444777000161', 'curitiba/parana', '[{\"tipo\":\"ABTS\",\"litragem\":800,\"quantidade\":10}]', 4.00, 15840.00, 'EM_ANALISE', '2026-04-14 22:51:31'),
(2, 3, 'Isabelly Lucas Koch', 'isabellykoch@gmail.com', '02589771088', '44986037895', 'empresa realiza antichamas', '56682664000132', 'Anápolis/Goiás', '[{\"tipo\":\"ABT\",\"litragem\":5000,\"quantidade\":5}]', 12.50, 49500.00, 'EM_ANALISE', '2026-04-16 10:38:49');

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `nome`, `email`, `senha`, `cpf`, `created_at`) VALUES
(1, 'Gabrielly', 'gaby@email.com', '$2b$10$hnRe6pEyaMDpodpoWoCrBO0j3lGDM60AityHhrcpWcZ/pdhUKQNT2', '12345678900', '2026-02-28 18:42:43'),
(3, 'Isabelly Lucas Koch', 'isabellykoch@gmail.com', '$2b$10$UIsIDU5.hRX4FzgUSybmGO843JJNhhKhmoThK8R6eMDi.wDiffOl.', '02589771088', '2026-04-16 01:18:08'),
(4, 'Isadora Soares', 'isadorasoares@gmail.com', '$2b$10$vMt6VfvFKXbqvy1WnN9lFeFi1efRZ2D.idI8/reHJbVO.25iwwcAi', '95843708047', '2026-04-16 01:31:20');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `contatos`
--
ALTER TABLE `contatos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `orcamentos`
--
ALTER TABLE `orcamentos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cpf` (`cpf`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `contatos`
--
ALTER TABLE `contatos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `orcamentos`
--
ALTER TABLE `orcamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
