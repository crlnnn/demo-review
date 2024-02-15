import './commands/cart/cartStepFlow'
import './commands/cart/shipmentSetup'
import './commands/fillFormInput'
import './commands/categoryLink'
import './commands/productDetail'

beforeEach(() => {
  const URL_COOKIE_BOT =
    'https://consentcdn.cookiebot.com/consentconfig/*/settings.json'
  const URL_CLARITY = 'https://w.clarity.ms/collect'
  const DIALOG_COOKIE_CONSTENT = '#CybotCookiebotDialog'
  const BTN_COOKIE_CONSENT =
    '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll'

  cy.intercept({
    method: 'GET',
    url: URL_COOKIE_BOT,
  }).as('consentRequestResponse')

  // Validate unrelated 3rd party
  Cypress.on('uncaught:exception', () => {
    return false
  })

  // Drop 3rd party request
  cy.intercept(URL_CLARITY, (req) => {
    req.destroy()
  })

  cy.visit('/')

  cy.get(BTN_COOKIE_CONSENT).click()

  // Server response timeout
  cy.wait('@consentRequestResponse', { timeout: 200000 })
    .its('response.statusCode')
    .should('eq', 200)
    .then(() => {
      console.log('COOKIES SUCCESSFULLY EATEN (ᵔᴥᵔ)')
    })
})
