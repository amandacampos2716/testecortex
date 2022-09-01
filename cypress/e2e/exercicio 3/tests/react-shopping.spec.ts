describe('Home Page React Shopping', () => {
  it('App deve estar online e compra ser realizada com sucesso', () => {
    cy.viewport(1440, 900);
    cy.visit('https://react-shopping-cart-67954.firebaseapp.com/');
    cy.get('#root div main div div div label').contains('XXL').click();
    cy.get('#root div main main div').contains('Loose Black T-shirt').parent().find('button').click();
    cy.get('#root div div button span').contains('X').parent().click();
    cy.get('#root div main main div').contains('Slim black T-shirt').parent().find('button').click();
    for (let i = 0; i < 3; i++) {
      cy.get('#root div div div div div').contains('Slim black T-shirt').parent().next().find('button').contains("+").click();
    }
    cy.get('#root div div div div span').contains('Cart').prev().children().should('have.text', '5');
    cy.get('#root div div div div p').contains('SUBTOTAL').next().children().eq(0).should('have.text', '$ 213.60');
    cy.get('#root div div div div button').contains('Checkout').click();
  });
});