/**
 * Survey CRUD testing
 */
describe('Survey Management Tests', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.login('admin', 'admin');
        cy.url().should('include', '/study-management');
    });

    it('should navigate to Survey Management page', () => {
        cy.visit('/survey-management');
        cy.url().should('include', '/survey-management');
    });

    it('should create, update, and delete a survey entry', () => {
        cy.visit('/survey-management');

        cy.wait(500);

        cy.get('button .pi-plus').click();
        cy.get('input[formControlName="question"]').type('test');
        cy.get('textarea[formControlName="answer"]').type('test');
        cy.get('p-autoComplete[formControlName="category"] input').type('Testing');

        cy.get('p-dropdown[formControlName="study"]').click();
        cy.get('.p-dropdown-item').contains('new').click();

        cy.get('button').contains('Save').click();

        cy.get('table tbody tr').first().within(() => {
            cy.get('td').eq(1).should('contain.text', 'test');
            cy.get('td').eq(2).should('contain.text', 'test');
            cy.get('td').eq(3).should('contain.text', 'Testing');
            cy.get('td').eq(4).should('contain.text', 'new');
        });

        cy.get('table tbody tr').first().within(() => {
            cy.get('button .pi-pencil').click();
        });
        cy.get('input[formControlName="question"]').clear().type('test2');
        cy.get('textarea[formControlName="answer"]').clear().type('test2');
        cy.get('p-autoComplete[formControlName="category"] input').clear().type('Testing');

        cy.get('button').contains('Save').click();

        cy.get('table tbody tr').first().within(() => {
            cy.get('td').eq(1).should('contain.text', 'test2');
            cy.get('td').eq(2).should('contain.text', 'test2');
            cy.get('td').eq(3).should('contain.text', 'Testing');
            cy.get('td').eq(4).should('contain.text', 'new');
        });

        cy.get('table tbody tr').first().within(() => {
            cy.get('button .pi-trash').click();
        });
        cy.get('table tbody tr').should('not.exist');
    });
});
