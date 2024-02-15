import './commands/cart/cartStepFlow'
import './commands/cart/shipmentSetup'
import './commands/categoryLink'
import './commands/productDetail'

beforeEach(() => {
  const URL_COOKIE_BOT =
    'https://consentcdn.cookiebot.com/consentconfig/*/settings.json'
  const DIALOG_COOKIE_CONSTENT = '#CybotCookiebotDialog'
  const BTN_COOKIE_CONSENT =
    '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll'

  cy.intercept({
    method: 'GET',
    url: URL_COOKIE_BOT,
  }).as('consentRequestResponse')

  // Validate unrelated 3rd party
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })

  // Drop 3rd party request
  cy.intercept('https://w.clarity.ms/collect', (req) => {
    req.destroy()
  })

  cy.visit('/')

  cy.get(BTN_COOKIE_CONSENT).click()

  cy.wait('@consentRequestResponse')
    .its('response.statusCode')
    .should('eq', 200)
    .then(() => {
      console.log('COOKIES SUCCESSFULLY EATEN (ᵔᴥᵔ)')
    })

  cy.get(DIALOG_COOKIE_CONSTENT).should('be.not.visible')
})
