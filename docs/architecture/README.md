# Arquitetura de Software — Projeto Realiza

## 1. Visão geral

O Projeto Realiza é uma plataforma digital desenvolvida para facilitar o gerenciamento de solicitações de orçamento do produto Realiza Anti Chamas.

A arquitetura foi organizada para atender às necessidades dos clientes e administradores, permitindo cadastro, autenticação, solicitação e acompanhamento de orçamentos, gerenciamento administrativo e envio de notificações.

## 2. Organização arquitetural

O sistema utiliza uma arquitetura composta por:

- **Frontend Web:** interface desenvolvida com React e Vite.
- **Aplicativo Mobile:** desenvolvido com React Native e Expo.
- **Backend:** API REST desenvolvida com Node.js e Express.
- **Banco de dados:** MySQL, responsável pelo armazenamento dos dados.
- **Serviço de notificações:** microserviço independente responsável pelo processamento de notificações.
- **Redis:** utilizado na comunicação por eventos entre os serviços.
- **Nginx:** atua como proxy reverso e ponto de entrada das requisições.
- **Docker Compose:** responsável pela orquestração dos containers.

## 3. Organização dos documentos

Os documentos e diagramas da arquitetura estão organizados nesta pasta, contemplando:

- Diagramas C4;
- Decisões arquiteturais (ADRs);
- Modelagem de domínio (DDD);
- Cenários de qualidade;
- Contratos de API;
- Modelo de dados;
- Estratégias de comunicação e integração entre serviços.

## 4. Objetivo

A documentação tem como objetivo apresentar as decisões técnicas, a estrutura dos componentes e a comunicação entre os serviços, mantendo a arquitetura alinhada aos requisitos funcionais e não funcionais do Projeto Realiza.