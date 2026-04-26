# 📚 Automação de Testes de API - Hub de Leitura

![Cypress](https://img.shields.io/badge/-cypress-%23E9E9E9?style=for-the-badge&logo=cypress&logoColor=30E3CA)
![Postman](https://img.shields.io/badge/-Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![JavaScript](https://img.shields.io/badge/-javascript-%23F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![EBAC](https://img.shields.io/badge/Curso-EBAC-red?style=for-the-badge)

## 🎯 Sobre o Projeto
Este repositório contém a automação de testes da API "Hub de Leitura", desenvolvida como parte do meu aprendizado na **EBAC**. O projeto foi estruturado em duas etapas: primeiro, realizei a exploração e validação manual dos endpoints via **Postman**, e em seguida, construí a arquitetura de testes automatizados utilizando **Cypress**.

## 🚀 O que eu desenvolvi:

* **Validação via Postman:** Antes da automação, utilizei o Postman para entender o comportamento da API, validar contratos e garantir que os fluxos principais (Happy Path) e de exceção estavam respondendo conforme o esperado.
* **Automação Completa com Cypress:** Migrei a lógica de testes para o Cypress, cobrindo o CRUD completo de usuários e livros.
* **Massa de Dados Inteligente:** Implementei lógica de sorteio aleatório para títulos e autores. Isso evita que os testes passem apenas por "vício de dados" e garante uma cobertura mais real.
* **Limpeza Automática (Teardown):** Criei uma estrutura de limpeza de dados para que, após cada execução, o ambiente volte ao estado original, evitando duplicidade ou falhas em execuções futuras.
* **Comandos Customizados:** Refatorei o código para usar `Cypress.Commands`, deixando os testes mais limpos, organizados e fáceis de manter.

## 🛠️ Tecnologias Utilizadas
* **Postman:** Exploração e testes manuais de API.
* **Cypress:** Framework para automação de testes.
* **JavaScript:** Linguagem base para os scripts.
* **Node.js:** Ambiente de execução.

## 🏁 Como rodar os testes na sua máquina

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/RodrigoRll-QA/teste-api-hub-leitura-books-task.git](https://github.com/RodrigoRll-QA/teste-api-hub-leitura-books-task.git)
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Abra o Cypress:**
    ```bash
    npx cypress open
    ```
    *Ou rode via terminal (modo headless):*
    ```bash
    npx cypress run
    ```

---
👋 Criado por **Rodrigo Lins Lopes** – QA Engineer em formação pela EBAC.