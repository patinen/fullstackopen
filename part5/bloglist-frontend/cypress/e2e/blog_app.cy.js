describe('Blog app', function () {
  beforeEach(() => {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Test Dude',
      username: 'testdude',
      password: 'salainen',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

    cy.visit('/') 
  })

  it('Login form is shown', function () {
    cy.contains('log in')
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('testdude')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Test Dude logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('testdude')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Test Dude logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'testdude', password: 'salainen' })
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('input[name="Title"]').type('Cypress Blog')
      cy.get('input[name="Author"]').type('Test Author')
      cy.get('input[name="URL"]').type('http://cypressblog.com')
      cy.contains('create').click()

      cy.contains('Cypress Blog')
    })
  })
})
  
  