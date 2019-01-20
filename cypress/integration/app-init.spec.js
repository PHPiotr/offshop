describe('App initialization', () => {
    it('Displays products from API on load', () => {
        cy.server();
        cy.route('GET', '/products', 'fixture:products');
        cy.visit('/');
    });
});