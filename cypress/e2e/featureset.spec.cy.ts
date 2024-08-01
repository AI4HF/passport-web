/**
 * Featureset CRUD testing
 */
describe('Featureset Management Tests', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.login('admin', 'admin');
        cy.url().should('include', '/study-management');
    });

    it('should navigate to Featureset Management page', () => {
        cy.visit('/featureset-management');
        cy.url().should('include', '/featureset-management');
    });

    it('should create, update, and delete a featureset', () => {
        cy.visit('/featureset-management');
        cy.wait(500);

        // Cancel create featureset
        cy.get('button .pi-plus').click();
        cy.url().should('include', '/new');
        cy.get('app-featureset-details button').contains('Back').click();
        cy.url().should('not.include', '/new');

        // Create featureset
        cy.get('button .pi-plus').click();
        cy.get('app-featureset-details').should('be.visible');
        cy.get('button').should('be.disabled');
        cy.get('input[formControlName="title"]').type('test');
        cy.get('input[formControlName="description"]').type('test');
        cy.get('input[formControlName="featuresetURL"]').type('test-url');
        cy.get('p-dropdown[formControlName="experiment"]').click();
        cy.get('.p-dropdown-item').contains('risk').click();
        cy.get('button').should('not.be.disabled');
        cy.get('button').contains('Next').click();

        // Add feature to the feature set
        cy.get('app-featureset-features-table').should('be.visible');
        cy.get('app-featureset-features-form').should('not.exist');
        cy.get('button .pi-plus').click();
        cy.get('app-featureset-features-form').should('be.visible');

        cy.get('app-featureset-features-form').within(() => {
            cy.get('input[formControlName="title"]').type('test-feature');
            cy.get('input[formControlName="description"]').type('test-description');
            cy.get('input[formControlName="dataType"]').type('test-dataType');
            cy.get('input[formControlName="featureType"]').type('test-featureType');
            cy.get('input[formControlName="units"]').type('test-units');
            cy.get('input[formControlName="equipment"]').type('test-equipment');
            cy.get('input[formControlName="dataCollection"]').type('test-dataCollection');
            cy.get('p-checkbox[formControlName="isUnique"]').click();
            cy.get('p-checkbox[formControlName="mandatory"]').click();
            cy.get('button').contains('Save').should('not.be.disabled');
            cy.get('button').contains('Save').click();
        });

        // edit feature
        cy.get('app-featureset-features-table button .pi-pencil').first().click();

        cy.get('app-featureset-features-form').within(() => {
            cy.get('input[formControlName="title"]').should('have.value', 'test-feature');
            cy.get('input[formControlName="description"]').should('have.value', 'test-description');
            cy.get('input[formControlName="dataType"]').should('have.value', 'test-dataType');
            cy.get('input[formControlName="featureType"]').should('have.value', 'test-featureType');
            cy.get('input[formControlName="units"]').should('have.value', 'test-units');
            cy.get('input[formControlName="equipment"]').should('have.value', 'test-equipment');
            cy.get('input[formControlName="dataCollection"]').should('have.value', 'test-dataCollection');
            cy.get('p-checkbox[formControlName="isUnique"] input').should('be.checked');
            cy.get('p-checkbox[formControlName="mandatory"] input').should('be.checked');

            cy.get('input[formControlName="title"]').clear().type('test-feature-edited');
            cy.get('input[formControlName="description"]').clear().type('test-description-edited');
            cy.get('input[formControlName="dataType"]').clear().type('test-dataType-edited');
            cy.get('input[formControlName="featureType"]').clear().type('test-featureType-edited');
            cy.get('input[formControlName="units"]').clear().type('test-units-edited');
            cy.get('input[formControlName="equipment"]').clear().type('test-equipment-edited');
            cy.get('input[formControlName="dataCollection"]').clear().type('test-dataCollection-edited');
            cy.get('p-checkbox[formControlName="isUnique"]').click(); // Uncheck if it was checked
            cy.get('p-checkbox[formControlName="mandatory"]').click(); // Uncheck if it was checked
            cy.get('button').contains('Save').click();
        });

        cy.get('app-featureset-features-table table tbody tr').last().within(() => {
            cy.get('td').eq(1).should('contain.text', 'test-feature-edited');
        });

        // delete feature
        cy.get('table tbody tr').last().within(() => {
            cy.get('button .pi-trash').click();
        });

        cy.get('app-featureset-features-table table tbody tr').should('not.exist');

        // Edit the feature set
        cy.visit('/featureset-management');
        cy.wait(500);

        cy.get('table tbody tr').last().within(() => {
            cy.get('button .pi-pencil').click();
        });

        cy.get('input[formControlName="title"]').should('have.value', 'test');
        cy.get('input[formControlName="description"]').should('have.value', 'test');
        cy.get('input[formControlName="featuresetURL"]').should('have.value', 'test-url');
        cy.get('p-dropdown[formControlName="experiment"] .p-dropdown-label').should('contain.text', 'risk');

        cy.get('input[formControlName="title"]').clear().type('test2');
        cy.get('input[formControlName="description"]').clear().type('test2');
        cy.get('input[formControlName="featuresetURL"]').clear().type('test2-url');
        cy.get('p-dropdown[formControlName="experiment"]').click();
        cy.get('.p-dropdown-item').contains('risk').click();
        cy.get('button').contains('Save').click();

        cy.visit('/featureset-management');
        cy.wait(500);

        cy.get('table tbody tr').last().within(() => {
            cy.get('td').eq(1).should('contain.text', 'test2');
            cy.get('td').eq(2).should('contain.text', 'test2');
            cy.get('td').eq(3).should('contain.text', 'test2-url');
        });

        // Delete the feature set
        cy.visit('/featureset-management');
        cy.wait(500);

        cy.get('table tbody tr').last().within(() => {
            cy.get('button .pi-trash').click();
        });

        cy.get('table tbody tr').should('not.contain', 'test2');
    });
});
