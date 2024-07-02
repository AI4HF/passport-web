/**
 * Login test method for easy use over all the other tests.
 */
Cypress.Commands.add('login', (username: string, password: string, rememberMe: boolean = false) => {
    cy.visit('/login');
    cy.get('input[formControlName="username"]').type(username);
    cy.get('input[formControlName="password"]').type(password);
    if (rememberMe) {
        cy.get('p-checkbox[formControlName="rememberMe"]').click();
    }
    cy.get('button[type="submit"]').click();
});

