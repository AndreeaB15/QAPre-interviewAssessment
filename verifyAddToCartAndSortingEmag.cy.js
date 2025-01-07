const waitingTimePageLoad = 3000;

function openEmagStore(){
  cy.visit('https://www.emag.ro/');
}

function openTVSection(){
  cy.get('.navbar-aux-content__departments').click();
  cy.get('.megamenu-list span').contains('TV, Audio-Video & Foto').click();
  cy.get('.megamenu-item').contains('Televizoare').click();
  cy.get('.emg-subd-banner-widget').filter(':visible').first().click();
}

function getFilterItem(){
  return cy.get('.js-filter-item.filter-item');
}

function filerByBrandTypeAndMinimumThreeStarsRating(brandName,typeName){
  const threeStarRatingPosition =2;
  cy.wait(waitingTimePageLoad);
  getFilterItem().contains(brandName).click();
  cy.wait(waitingTimePageLoad);
  getFilterItem().contains(typeName).click();
  cy.wait(waitingTimePageLoad);
  cy.get('.star-rating').eq(threeStarRatingPosition).click();
}

function sortBySpecific(sortingName){
  cy.get('.sort-control-btn-dropdown').eq(0).click({force:true});
  cy.get('.js-sort-option').contains(sortingName).click({force:true});
}

function addToCart(){
  cy.get('.btn.btn-emag').contains('Adauga in Cos').first().click();
}

function closeCartModalAndSwitchToAccesories(){
  cy.wait(waitingTimePageLoad);
  cy.get('button.close').click({multiple:true});
  cy.get('.js-sidebar-tree-url').contains('Accesorii TV ').click();
  cy.wait(waitingTimePageLoad);
}

function closeCartModalAndEnterToCart(){
  cy.wait(waitingTimePageLoad);
  cy.get('button.close').click({multiple:true});
  cy.get('.em-cart2').click();
}

function verifyCart(){
  cy.get('.cart-line ').should('have.length',2);
  cy.get('.line-item-title.main-product-title').each((item) => {
    cy.wrap(item)
      .invoke('text') 
      .then((text) => {
        expect(text.toLowerCase()).to.include('samsung');
      });
  });
}

describe('Add TV and Accessory to Cart', () => {
  before(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false; 
    });
  });
  it('add the most expensive TV and the cheapest accessor to the cart', () => {
    openEmagStore();
    openTVSection();
    sortBySpecific('Pret descrescator');
    filerByBrandTypeAndMinimumThreeStarsRating('Samsung','OLED');
    addToCart();
    closeCartModalAndSwitchToAccesories();
    sortBySpecific('Pret crescator');
    filerByBrandTypeAndMinimumThreeStarsRating('Samsung','Cablu alimentare');
    addToCart();
    closeCartModalAndEnterToCart();
    verifyCart();
  });
});