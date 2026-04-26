// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('geraToken', (email, senha) => {
    cy.request({
        method: 'POST', 
        url: 'login', 
        body: {
            email: email,
            password: senha
        }
    }).then((response) => {
       expect(response.status).to.equal(200) 
       return response.body.token
    })
 })

 Cypress.Commands.add('cadastrarUsuario', (nome, email, senha) =>{
        cy.api({
            method: 'POST',
            url: 'users',
            body: {
                "name": nome,
                "email": email,
                "password": senha
            }
        }).then(response => {
            expect(response.status).to.equal(201)
            return response.body.user.id
        })
 })

Cypress.Commands.add('getBooks', (token, params = {}) => {
  return cy.api({
    method: 'GET',
    url: 'books',
    qs: params,
    headers: { authorization: token }
  })
})


Cypress.Commands.add('postBook', (token, body, failOnStatusCode = true) => {
  return cy.api({
    method: 'POST',
    url: 'books',
    body: body,
    headers: { authorization: token },
    failOnStatusCode: failOnStatusCode
  })
})


Cypress.Commands.add('putBook', (token, id, body, failOnStatusCode = true) => {
    return cy.api({
        method: 'PUT',
        url: `/books/${id}`,
        body: body,
        headers: { authorization: token },
        failOnStatusCode: failOnStatusCode
    })
})


Cypress.Commands.add('deleteBook', (token, id, failOnStatusCode = true) => {
  return cy.api({
    method: 'DELETE',
    url: `books/${id}`,
    headers: { authorization: token },
    failOnStatusCode: failOnStatusCode
  })
})