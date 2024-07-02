/**
 * Study CRUD testing
 */
describe('Study Management Tests', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.login('admin', 'admin');
        cy.url().should('include', '/study-management');
    });

    it('should create, update, and delete a study entry using the multi-step form', () => {
        cy.wait(500);

        cy.get('button .pi-plus').click();
        cy.get('input[formControlName="name"]').type('test');
        cy.get('input[formControlName="description"]').type('test');
        cy.get('input[formControlName="objectives"]').type('test');
        cy.get('input[formControlName="ethics"]').type('test');
        cy.get('button').contains('Next').click();

        cy.get('input[formControlName="populationUrl"]').type('test');
        cy.get('input[formControlName="description"]').type('test');
        cy.get('input[formControlName="characteristics"]').type('test');

        cy.get('.stepper').contains('Survey Inspection').click();
        cy.get('button').contains('Finish').click();

        cy.get('table tbody tr').first().within(() => {
            cy.get('td').eq(1).should('contain.text', 'test');
            cy.get('td').eq(2).should('contain.text', 'test');
            cy.get('td').eq(3).should('contain.text', 'test');
            cy.get('td').eq(4).should('contain.text', 'test');
        });

        cy.get('table tbody tr').first().within(() => {
            cy.get('button .pi-pencil').click();
        });

        cy.get('input[formControlName="name"]').should('have.value', 'test');
        cy.get('input[formControlName="description"]').should('have.value', 'test');
        cy.get('input[formControlName="objectives"]').should('have.value', 'test');
        cy.get('input[formControlName="ethics"]').should('have.value', 'test');

        cy.get('input[formControlName="name"]').clear().type('test2');
        cy.get('input[formControlName="description"]').clear().type('test2');
        cy.get('input[formControlName="objectives"]').clear().type('test2');
        cy.get('input[formControlName="ethics"]').clear().type('test2');
        cy.get('button').contains('Save').click();
        cy.get('.stepper').contains('Survey Inspection').click();

        cy.get('button').contains('Finish').click();

        cy.get('table tbody tr').first().within(() => {
            cy.get('td').eq(1).should('contain.text', 'test2');
            cy.get('td').eq(2).should('contain.text', 'test2');
            cy.get('td').eq(3).should('contain.text', 'test2');
            cy.get('td').eq(4).should('contain.text', 'test2');
        });

        cy.get('table tbody tr').first().within(() => {
            cy.get('button .pi-trash').click();
        });

        cy.get('table tbody tr').should('not.exist');
    });
});
