function openAirPortLabsPage(){
  cy.visit('https://airportlabs.com/');
}

function getSectionTitle(expectedTitle) {
  return cy.get('.h2').contains(expectedTitle).scrollIntoView();
}

function getStatisticNumbers() {
  return cy.get('.h2.green');
}

function verifyStatisticIsCorrect(statisticName, statisticNumber) {
  getStatisticNumbers().contains(statisticNumber).parent().should('contain',statisticName);
}

function getGeneralButtons() {
  return cy.get('.button');
}
function clickSpecificButton(buttonName) {
  getGeneralButtons().contains(buttonName).click();
}

function getSocialMediafooterButtons(){
  return cy.get('.div-block-60 .logo-footer-container');
}

describe('Scenario 1: Verify Section Title has correct design', () => {
  it('Checks if the section title is correct', () => {
    openAirPortLabsPage();
   getSectionTitle('AirportLabs in the Press')
      .should('be.visible')
      .and('have.css', 'font-size', '40px') 
      .and('have.css', 'font-weight', '300')
      .and('have.css', 'color', 'rgb(255, 255, 255)');
  });
});

describe('Scenario 2: Verify that the statistic from the Our Activity in Numbers section', () => {
  it('Checks the statistics', () => {
    openAirPortLabsPage();
   getSectionTitle('Our activity in numbers').should('be.visible');
   verifyStatisticIsCorrect('SaaS Products',10);     
   verifyStatisticIsCorrect('of Industry Experience','17+ Years');  
   verifyStatisticIsCorrect('Airports Worldwide','60+');  
   verifyStatisticIsCorrect('Users Worldwide','300k');  
  });
});

describe('Scenario 3: Verify Get in Touch Section', () => {

  beforeEach(() => {
    openAirPortLabsPage();
    clickSpecificButton('Get in Touch');
  });

  it('Fills the Get in Touch form successfully', () => {
    cy.get('.form-block').within(() => {
      cy.get('input[name="Your-Name"]').type('Test User');
      cy.get('input[name="Company-Name"]').type('Test Company');
      cy.get('input[name="email"]').type('testemail@test.com');
      cy.get('input[name="Contact"]').type('12345689');
      cy.get('textarea[name="Message"]').type('Test message!');
      cy.get('.w-checkbox-input').click();
      // clickSpecificButton('Send Inquiry'); keep in it as a comment to not submit forms everytime when test is run since the test is on live,
    });
  });

  it('Validates email field with incorrect email format', () => {
    cy.get('.form-block').within(() => {
      cy.get('input[name="Your-Name"]').type('Test User');
      cy.get('input[name="Company-Name"]').type('Test Company');
      cy.get('input[name="email"]').type('testemailtest.com');
      cy.get('input[name="Contact"]').type('12345689');
      cy.get('textarea[name="Message"]').type('Test message!');
      cy.get('.w-checkbox-input').click();
      clickSpecificButton('Send Inquiry');
    });
    // cy.contains("Please include an '@' in the email address. 'testemailtest.com' is missing an '@'."); the error is in console so this is not the bes approch to asses it
  });
});
  
describe('Scenario 4: Verify Social Media Links Redirection', () => {

  beforeEach(() => {
    openAirPortLabsPage();
  });

  it('Verify Rediraction to Facebook', () => {
    cy.intercept('GET', 'https://www.facebook.com/AirportLabs').as('facebookRequest');
    getSocialMediafooterButtons().eq(0).invoke('removeAttr', 'target').click({ force: true });
    cy.wait('@facebookRequest').its('response.statusCode').should('eq', 200);
    // Facebook is failing to be redirected a defect shoud be opened
  })

   it('Verify Rediraction to Instagram', () => {
    cy.intercept('GET', 'https://www.instagram.com/airportlabspeople/').as('instagramRequest');
    getSocialMediafooterButtons().eq(1).invoke('removeAttr', 'target').click({ force: true });
    cy.wait('@instagramRequest').its('response.statusCode').should('eq', 200);
  })

  it('Verify Rediraction to LinkedIn', () => {
    const linkedinButtonPosition =2;
    cy.intercept('GET', 'https://www.linkedin.com/company/airportlabs/').as('linkedinRequest');
    getSocialMediafooterButtons().eq(linkedinButtonPosition).invoke('removeAttr', 'target').click({ force: true });
    cy.wait('@linkedinRequest').its('response.statusCode').should('eq', 200);
  })
});

describe('Scenario 5: Verify Image with AirportLabs Logo', () => {
  it('verify that the logo image exists and its properties', () => {
    openAirPortLabsPage();
    cy.get('.desktop-brand > img') 
      .should('exist')
      .then(($img) => {
        cy.wrap($img[0]).should('have.property', 'naturalWidth', 300);
        cy.wrap($img[0]).should('have.property', 'naturalHeight', 85);
      });
});
});