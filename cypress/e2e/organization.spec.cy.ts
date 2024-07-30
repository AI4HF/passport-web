/**
 * Organization CRUD testing
 */
describe('Organization Management Tests', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.login('admin', 'admin');
        cy.url().should('include', '/study-management');
    });

    it('should fail Personnel access and redirect to Organization table', () => {
        cy.visit('/organization-management/personnel');

        cy.url().should('include', '/organization-management/organization');
    });

    it('should access Organization Management and test CRUD operations', () => {
        cy.visit('/organization-management/organization');

        cy.url().should('include', '/organization-management/organization');

        cy.wait(500);

        cy.get('button').contains('Delete Organization').should('be.visible').click();
        cy.get('p')
            .contains('No Active Organizations. Please create a new one.');

        cy.get('button').contains('Create Organization').should('be.visible').click();
        cy.get('input[formControlName="name"]').type('test');
        cy.get('textarea[formControlName="address"]').type('test');
        cy.get('button').contains('Save').click();

        cy.get('#org-name-input').should('have.value', 'test');
        cy.get('textarea').should('have.value', 'test');

        cy.get('button').contains('Update Organization').should('be.visible').click();
        cy.get('input[formControlName="name"]').should('have.value', 'test').clear().type('test2');
        cy.get('textarea[formControlName="address"]').should('have.value', 'test').clear().type('test2');
        cy.get('button').contains('Save').click();

        cy.get('#org-name-input').should('have.value', 'test2');
        cy.get('textarea').should('have.value', 'test2');
    });

    it('should use small edit buttons to update fields individually', () => {
        cy.visit('/organization-management/organization');

        cy.wait(500);

        cy.get('button .pi-pencil').first().click({force: true});
        cy.get('#org-name-input').clear().type('test3');
        cy.get('button .pi-check').first().click({force: true});
        cy.get('#org-name-input').should('have.value', 'test3');

        cy.get('button .pi-pencil').eq(1).click({force: true});
        cy.get('textarea').clear().type('test3');
        cy.get('button .pi-check').first().click({force: true});
        cy.get('textarea').should('have.value', 'test3');
    });
});
