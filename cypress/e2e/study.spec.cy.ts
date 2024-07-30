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

        // create study
        cy.get('button .pi-plus').click();
        cy.get('button').should('be.disabled');
        cy.get('input[formControlName="name"]').type('test');
        cy.get('input[formControlName="description"]').type('test');
        cy.get('input[formControlName="objectives"]').type('test');
        cy.get('input[formControlName="ethics"]').type('test');
        cy.get('button').should('not.be.disabled');
        cy.get('button').contains('Next').click();

        cy.get('input[formControlName="populationUrl"]').type('test');
        cy.get('input[formControlName="description"]').type('test');
        cy.get('input[formControlName="characteristics"]').type('test');

        cy.get('.stepper').contains('Survey Inspection').click();
        cy.get('button').contains('Finish').click();

        cy.get('table tbody tr').last().within(() => {
            cy.get('td').eq(1).should('contain.text', 'test');
            cy.get('td').eq(2).should('contain.text', 'test');
            cy.get('td').eq(3).should('contain.text', 'test');
            cy.get('td').eq(4).should('contain.text', 'test');
        });

        // edit study
        cy.get('table tbody tr').last().within(() => {
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

        cy.get('table tbody tr').last().within(() => {
            cy.get('td').eq(1).should('contain.text', 'test2');
            cy.get('td').eq(2).should('contain.text', 'test2');
            cy.get('td').eq(3).should('contain.text', 'test2');
            cy.get('td').eq(4).should('contain.text', 'test2');
        });

        // delete study
        cy.get('table tbody tr').last().within(() => {
            cy.get('button .pi-trash').click();
        });
    });

    it('should stepper be disabled if study is created, otherwise stepper should be active to switch between forms', () => {
        cy.wait(500);
        cy.get('button .pi-plus').click();

        cy.get('.p-timeline-event-content .cursor-pointer').each(($step, index) => {
            cy.wrap($step).click();
            cy.url().should('include', '/study-management/new/study-details');
        });

        cy.visit('/study-management');
        cy.wait(500);
        cy.get('button .pi-pencil').click();

        cy.get('.p-timeline-event-content .cursor-pointer').each(($step, index) => {
            const stepName = $step.text().trim().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace(/\s+/g, '-');
            cy.wrap($step).click();
            const expectedUrl = `/${stepName}`;
            cy.url().should('include', expectedUrl);
        });
    });
});
