# Projeto Realiza Anti Chamas

## Sobre o projeto

O Sistema Realiza é uma plataforma digital desenvolvida para facilitar a solicitação e o acompanhamento de orçamentos do produto Realiza Anti Chamas.

A solução permite que clientes realizem seu cadastro, solicitem orçamentos e acompanhem suas solicitações. Também disponibiliza uma área administrativa para gerenciamento de usuários, orçamentos e indicadores do sistema.

## Tecnologias utilizadas

- **Frontend Web:** React, Vite e TypeScript.
- **Aplicativo Mobile:** React Native e Expo.
- **Backend:** Node.js, Express e TypeScript.
- **Banco de dados:** MySQL.
- **Cache e comunicação por eventos:** Redis.
- **Serviço de notificações:** Node.js e TypeScript.
- **Infraestrutura:** Docker Compose e Nginx.
- **Testes:** Playwright.

## Estrutura do projeto

- `backend/`: API principal do sistema.
- `frontend/`: aplicação web.
- `mobile/`: aplicativo mobile.
- `notification-service/`: serviço responsável pelo processamento de notificações.
- `docs/architecture/`: documentação técnica e decisões arquiteturais.
- `docs/features/`: documentação das funcionalidades.
- `.github/workflows/`: configuração dos pipelines de CI/CD.

## Execução do projeto

A infraestrutura pode ser iniciada utilizando Docker Compose:

```bash
docker compose up -d
```

Para verificar os serviços:

```bash
docker compose ps
```

## Documentação

A documentação da arquitetura está disponível em `docs/architecture/`, incluindo diagramas, ADRs, modelagem DDD, cenários de qualidade, observabilidade, estratégias de resiliência e especificação OpenAPI.

## Objetivo

Organizar e centralizar o processo de solicitação e gerenciamento de orçamentos, melhorando o atendimento aos clientes e facilitando as atividades administrativas.
