/// <reference types="cypress" />

describe('Testes da Funcionalidade Catálogo de Livros', () => {
    let token
    let idParaLimpar = null

    beforeEach(() => {
        idParaLimpar = null
        cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
            token = tkn
            cy.log('✅ **Autenticação:** Token de Admin capturado com sucesso.');
        })
    });

    afterEach(() => {
        if (idParaLimpar) {
            cy.deleteBook(token, idParaLimpar, false).then(() => {
                cy.log(`♻️ **Limpeza:** Livro ID ${idParaLimpar} removido automaticamente.`);
            });
        }
    });

    it('GET - Deve listar livros com filtros e paginação', () => {
        cy.getBooks(token).then((resGeral) => {
            const books = resGeral.body.books;
            const total = books.length;

            cy.log(`📋 **Listagem:** Encontrados ${total} livros no catálogo.`);

            const amostraAleatoria = books
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);

            amostraAleatoria.forEach((livro) => {
                cy.getBooks(token, { category: livro.category, author: livro.author }).then((response) => {
                    expect(response.status).to.eq(200);

                    response.body.books.forEach((itemFiltrado) => {
                        expect(itemFiltrado.category).to.eq(livro.category);
                    });

                    cy.log(`🔍 **Filtro Aleatório:** Validada categoria [${livro.category}] com o livro [${livro.title}]`);
                });
            });
        });
    });

    it('GET - Deve obter detalhes de um livro específico', () => {
        cy.getBooks(token).then((resLista) => {
            const livro = resLista.body.books[Math.floor(Math.random() * resLista.body.books.length)];
            cy.log(`🎲 **Sorteio:** Validando detalhes do livro ID: ${livro.id}`);

            cy.api({ method: 'GET', url: `books/${livro.id}`, headers: { authorization: token } }).then((response) => {
                expect(response.status).to.eq(200);
                cy.log(`📖 **Detalhes:** Título verificado: ${response.body.book.title}`);
            });
        });
    });

    it('POST - Deve cadastrar um novo livro e validar permissão', () => {
        const idUnico = Math.floor(Math.random() * 1000000);
        const novoLivro = { title: `Cypress Masterclass ${idUnico}`, author: "Rodrigo Lopes", category: "Tecnologia", isbn: `978-${idUnico}`, publication_year: 2026, editor: "EBAC", pages: 250, format: "Físico" };

        cy.postBook(token, novoLivro).then((response) => {
            expect(response.status).to.eq(201);
            idParaLimpar = response.body.book.id; // Captura ID para limpeza
            cy.log(`✨ **Cadastro:** Livro "${novoLivro.title}" criado com sucesso.`);
        });

        cy.geraToken('usuario@teste.com', 'user123').then((tokenComum) => {
            cy.postBook(tokenComum, { title: "Negado" }, false).then((res) => {
                expect(res.status).to.be.oneOf([401, 403]);
                cy.log('🛡️ **Segurança:** Usuário comum impedido de cadastrar livros.');
            });
        });
    });

    it('POST - Deve rejeitar livro com dados inválidos', () => {
        cy.postBook(token, { publication_year: "Invalido" }, false).then((res) => {
            expect(res.status).to.eq(400);
            cy.log(`⚠️ **Validação:** API rejeitou ano inválido. Mensagem: ${res.body.message || 'Erro de validação'}`);
        });
    });

    it('PUT - Deve atualizar um livro e confirmar via GET', () => {
        const idUnico = Math.floor(Math.random() * 1000000);
        const novoTitulo = `Editado ${idUnico}`;
        const autor = 'Rodrigo Lins Lopes';

        cy.postBook(token, { title: `Antes ${idUnico}`, author: autor, isbn: `ISB${idUnico}`, category: "TI" }).then((resPost) => {
            const id = resPost.body.book.id;
            idParaLimpar = id; // Captura ID para limpeza

            cy.putBook(token, id, { title: novoTitulo, author: autor, category: 'Automação' }).then((resPut) => {
                expect(resPut.status).to.eq(200);
                cy.log(`📝 **Edição:** Livro ${id} alterado para "${novoTitulo}"`);

                cy.api({ method: 'GET', url: `books/${id}`, headers: { authorization: token } }).then(resGet => {
                    expect(resGet.body.book.title).to.eq(novoTitulo);
                    cy.log('✅ **Persistência:** Alteração confirmada no banco de dados.');
                });
            });
        });
    });

    it('DELETE - Deve deletar um livro e validar segurança', () => {
        cy.postBook(token, { title: "Deletar", author: "Rodrigo", isbn: `DEL-${Date.now()}`, category: "TI" }).then((resPost) => {
            const id = resPost.body.book.id;

            cy.deleteBook(token, id).then((resDel) => {
                expect(resDel.status).to.be.oneOf([200, 204]);
                cy.log(`🗑️ **Exclusão:** Livro ID ${id} removido pelo Admin.`);
            });

            cy.geraToken('usuario@teste.com', 'user123').then((tknUser) => {
                cy.deleteBook(tknUser, id, false).then(res => {
                    expect(res.status).to.be.oneOf([401, 403]);
                    cy.log('🛡️ **Segurança:** Tentativa de exclusão por usuário comum negada.');
                });
            });
        });
    });

    it('GET - Listar Categorias e Autores', () => {
        cy.api({ method: 'GET', url: 'books/categories', headers: { authorization: token } }).then(res => {
            cy.log(`🏷️ **Categorias:** ${res.body.categories.length} categorias listadas.`);
        });

        cy.api({ method: 'GET', url: 'books/authors', headers: { authorization: token } }).then(res => {
            cy.log(`✍️ **Autores:** ${res.body.authors.length} autores listados.`);
        });
    });
});