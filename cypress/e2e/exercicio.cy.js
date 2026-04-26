/// <reference types="cypress" />

let token
let idParaLimpar = null

beforeEach(() => {
    idParaLimpar = null
    cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
        token = tkn
        cy.log('✅ **Autenticação:** Token capturado.')
    })
});

afterEach(() => {
    if (idParaLimpar) {
        cy.deleteBook(token, idParaLimpar, false).then(() => {
            cy.log(`♻️ **Limpeza:** Livro ID ${idParaLimpar} removido.`)
        })
    }
});

describe('GET - Teste de API - Catálogo de Livros', () => {

    it('Deve listar livros com sucesso', () => {
        const parametros = {
            page: 1,
            limit: 10,
            category: 'Fantasia',
            author: 'J.R.R. Tolkien'
        }

        cy.getBooks(token, parametros).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body.books).to.be.an('array')
            if (response.body.books.length > 0) {
                expect(response.body.books[0]).to.have.property('author')
                expect(response.body.books[0]).to.have.property('category')
                expect(response.body.books[0].category).to.equal(parametros.category)
                expect(response.body.books[0].author).to.equal(parametros.author)
                cy.log('✅ **Propriedades:** Autor e Categoria validados no primeiro item.')
            }
            expect(response.body.books.length).to.be.at.most(parametros.limit)
            cy.log(`📋 **Paginação:** Página ${parametros.page} carregada com sucesso.`)
            cy.log(`📚 **Resultados:** Encontrados ${response.body.books.length} livros nesta página.`)
        })
    });

    it('Deve buscar um livro específico por ID via sorteio', () => {
        cy.getBooks(token).then(res => {
            const lista = res.body.books
            const livroSorteado = lista[Math.floor(Math.random() * lista.length)]

            cy.api({
                method: 'GET',
                url: `books/${livroSorteado.id}`,
                headers: { 'Authorization': token }
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body.book).to.include.all.keys(
                    'id', 'title', 'author', 'description', 'category', 'isbn', 'editor', 'language', 'publication_year', 'pages', 'format', 'total_copies', 'available_copies', 'cover_image', 'created_at'
                )
                expect(response.body.book.id).to.equal(livroSorteado.id)
                expect(response.body.book.title).to.equal(livroSorteado.title)
                cy.log(`🎲 **Sorteio:** Validado livro ID: ${livroSorteado.id}`)
            })
        })
    });
});

describe('POST - Teste de API - Catálogo de Livros', () => {

    it('Deve cadastrar um livro com sucesso', () => {
        let idUnico = Date.now()
        cy.postBook(token, {
            title: `Rodrigo Lins ${idUnico}`,
            author: "Rodrigo Lopes",
            category: "Tecnologia",
            isbn: `978-${idUnico}`,
            publication_year: 2026
        }).then(response => {
            expect(response.status).to.equal(201)
            idParaLimpar = response.body.book.id
            cy.log('✨ **Cadastro:** Livro criado com sucesso.')
        })
    });

    it('Deve validar erro ao cadastrar livro com item inválido', () => {
        cy.postBook(token, {
            title: "Erro de Ano",
            author: "Rodrigo Lins Lopes",
            publication_year: "Dois mil e vinte e seis"
        }, false).then(response => {
            expect(response.status).to.equal(400)
            cy.log('⚠️ **Validação:** Erro de ano inválido confirmado.')
        })
    });

    it('Deve impedir cadastro por usuário comum', () => {
        cy.geraToken('usuario@teste.com', 'user123').then(tokenComum => {
            cy.postBook(tokenComum, {
                title: "Sem autorização",
                author: "Rodrigo Lins Lopes"
            }, false).then(response => {
                expect(response.status).to.be.oneOf([401, 403])
                cy.log('🛡️ **Segurança:** Usuário comum não autorizado.')
            })
        })
    });
});

describe('PUT - Teste de API - Catálogo de Livros', () => {

    it('Deve atualizar um livro de forma dinâmica', () => {
        let idUnico = Date.now()
        cy.postBook(token, {
            title: "Antes da Edição",
            author: "Rodrigo",
            isbn: `ISB${idUnico}`
        }).then(res => {
            const bookId = res.body.book.id
            idParaLimpar = bookId

            cy.putBook(token, bookId, {
                title: "Título Editado",
                author: "Rodrigo Lins Lopes",
                category: "Automação"
            }).then(response => {
                expect(response.status).to.equal(200)
                cy.log('📝 **Edição:** Alteração concluída.')
            })
        })
    });

    it('Deve impedir que usuário comum edite um livro', () => {
        let idUnico = Date.now()
        cy.postBook(token, {
            title: `Livro para edição proibida`,
            author: 'Rodrigo Lins Lopes',
            isbn: `PROT${idUnico}`
        }).then(res => {
            const bookId = res.body.book.id
            idParaLimpar = bookId

            cy.geraToken(
                'usuario@teste.com',
                'user123'
            ).then(tokenComum => {
                cy.putBook(tokenComum, bookId, {
                    title: 'Tentativa de Hackear',
                    author: 'Rodrigo Lins Lopes'
                }, false).then(response => {
                    expect(response.status).to.equal(403)
                    expect(response.body.message).to.contain('Apenas administradores')
                    cy.log('🛡️ **Segurança:** Bloqueio confirmado com 403.')
                })
            })
        })
    });
});

describe('DELETE - Teste de API - Catálogo de Livros', () => {

    it('Deve excluir um livro com sucesso', () => {
        let idUnico = Date.now()
        cy.postBook(token, {
            title: "Para apagar",
            author: "Rodrigo",
            isbn: `DEL${idUnico}`
        }).then(res => {
            const bookId = res.body.book.id

            cy.deleteBook(token, bookId).then(response => {
                expect(response.status).to.be.oneOf([200, 204])
                cy.log('🗑️ **Exclusão:** Livro removido com sucesso.')
            })
        })
    });

    it('Deve impedir que usuário comum exclua um livro', () => {
        let idUnico = Date.now()
        cy.postBook(token, {
            title: "Livro Protegido contra Deleção",
            author: "Rodrigo Lins Lopes",
            isbn: `NODEL${idUnico}`
        }).then(res => {
            const bookId = res.body.book.id
            idParaLimpar = bookId

            cy.geraToken('usuario@teste.com', 'user123').then(tokenComum => {
                cy.deleteBook(tokenComum,
                    bookId, false).then(response => {
                        expect(response.status).to.equal(403)
                        expect(response.body.message).to.contain('Apenas administradores')
                        cy.log('🛡️ **Segurança:** Bloqueio de deleção confirmado para usuário comum.')
                    })
            })
        })
    });
});