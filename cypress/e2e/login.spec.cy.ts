/**
 * Login test cases with different variations successful and failed Login attempts
 */
describe('Login Page', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should show an error for invalid credentials', () => {
        cy.login('invalid-user', 'invalid-password');
        cy.get('.p-toast-message').should('contain', 'Invalid username or password.');
    });

    it('should login and store token in localStorage if remember me is checked', () => {
        cy.login('admin', 'admin', true);
        cy.url().should('include', '/study-management');
        cy.window().then((window) => {
            const token = window.localStorage.getItem('token');
            expect(token).to.exist;
        });
    });

    it('should login and store token in sessionStorage if remember me is not checked', () => {
        cy.login('admin', 'admin');
        cy.url().should('include', '/study-management');
        cy.window().then((window) => {
            const token = window.sessionStorage.getItem('token');
            expect(token).to.exist;
        });
    });
});
