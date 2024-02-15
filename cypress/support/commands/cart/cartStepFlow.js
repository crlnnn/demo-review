beforeEach(() => {
  cy.intercept('GET', '**/graphql?query=query(*').as('graphqlDataLoad')
  cy.intercept(
    'POST',
    '**.drmax.cz/rest/default/V1/delivery-calculation/separate'
  )
})

function waitForGraphQLDataLoadAndAssert() {
  // Server response timeout
  cy.wait('@graphqlDataLoad', { timeout: 200000 }).then(({ response }) => {
    expect(response.statusCode).to.equal(200)
  })
}

function assertCartFormAndItemDeliveryVisibility() {
  const FORM_CART = '.checkout-steps__form'
  const CART_DELIVERY_AREA = '.cart-item__delivery'

  cy.get(FORM_CART).should('be.visible')

  if (Cypress.env('locale') === 'cs') {
    cy.get(CART_DELIVERY_AREA).should('be.visible')
  }
}

Cypress.Commands.add('goToCartViaDropdown', () => {
  const HEADER_ICON_CART_LINK = '[data-test-id="microcart-button"]'
  const DROPDOWN_CART_CONTENT = '[data-test-id="basket-content"]'
  const DROPDOWN_CART_BTN_CHECKOUT =
    '[data-test-id="basket-content-go-to-checkout-button"]'

  cy.get(HEADER_ICON_CART_LINK).should('be.visible').click()
  cy.get(DROPDOWN_CART_CONTENT).should('be.visible')
  cy.get(DROPDOWN_CART_BTN_CHECKOUT).click()

  waitForGraphQLDataLoadAndAssert()

  assertCartFormAndItemDeliveryVisibility()
})

Cypress.Commands.add('goToCartViaProductDetailModal', () => {
  const BTN_MODAL_GO_TO_CART =
    '[data-test-id="product-cart-modal-go-to-cart-button"]'

  cy.get(BTN_MODAL_GO_TO_CART).should('be.visible').click()
  waitForGraphQLDataLoadAndAssert()

  assertCartFormAndItemDeliveryVisibility()
})

Cypress.Commands.add('goToCartDeliveryStep', () => {
  const BTN_CART_DELIVERY_STEP = '[data-test-id="checkout-continue-button"]'
  const FORM_DELIVERY = 'form[name="stepForm"]'

  cy.get(BTN_CART_DELIVERY_STEP).should('not.have.class', 'disabled').click()
  waitForGraphQLDataLoadAndAssert()

  cy.get(FORM_DELIVERY).should('be.visible')
})
