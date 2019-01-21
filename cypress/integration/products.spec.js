describe('Products page', () => {
    it('should display products from API on load', () => {
        cy.seedProductsAndVisit();
        cy.get('ul li').should('have.length', 4);
    });
    it('should show incremented number of items when product added to cart', () => {
        cy.seedProductsAndVisit();
        cy.get('span[class^="MuiBadge-badge"]').as('cartBadge');
        cy.get('@cartBadge').should('have.length', 1);
        cy.get('@cartBadge').should($cartBadge => {
            expect($cartBadge).to.contain('0');
        });
        cy.get('ul li:first').find('button').click();
        cy.get('@cartBadge').should($cartBadge => {
            expect($cartBadge).to.contain('1');
        });
    });
});
