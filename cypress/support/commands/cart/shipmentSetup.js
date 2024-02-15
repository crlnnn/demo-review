import randomElement from '../../utilities/randomElement'

export const shipment_name = {
  DPD: 'DPD',
  PICKUP_PLACE: 'PICKUP_PLACE',
}

  const SELECTOR_PICKUP_PLACE =
    'label[for="drmaxclickandcollectshipping~drmaxclickandcollectshipping"]'
  const PICKUP_LIST_WRAPPER = '[datac-test-id="pickup-list-wrapper"]'
  const PICKUP_DETAIL_WRAPPER = '[datac-test-id="pickup-detail-wrapper"]'

  cy.get(SELECTOR_PICKUP_PLACE).should('be.visible').click()

  cy.wait('@geolocationData').then((interception) => {
    expect(interception.response.body.coords.latitude).to.eq(50.0874654)
    expect(interception.response.body.coords.longitude).to.eq(14.4212535)
  })

  cy.get('.modal-content').should('be.visible')

  cy.get('.form-control')
    .should('be.visible')
    .click()
    // Enter first & second value for search autocomplete, third click -> send request (Yes, I am not happy with this either, quickfix)
    .type('Praha', '{ enter }', '{ enter }', '{ enter }')

  randomElement(PICKUP_LIST_WRAPPER)

  cy.get(PICKUP_DETAIL_WRAPPER).should('be.visible')

Cypress.Commands.add('chooseDelivery', (shipment) => {
  cy.intercept('POST', Cypress.env('url').graphQL, (req) => {
    if (req.body.operationName === 'setShippingMethodsOnCart') {
      req.alias = 'setShippingMethod'
    }
  })

  const SHIPPING_WRAPPER = '[data-test-id="checkout-shipping-methods-wrapper"]'
  const SELECTOR_DPD = 'label[for="drmaxshippingdpd~drmaxshippingdpd"]'
  const BTN_SUBMIT_PICKUP_PLACE =
    '.pickup-info__bottom .btn-success-highlighted'
  const SELECTED_SHIPMENT_OPTION = '.shipping-radio--selected'

  cy.get(SHIPPING_WRAPPER).should('be.visible')

  switch (shipment) {
    case 'DPD':
      cy.get(SELECTOR_DPD).click()
      break
    case 'PICKUP_PLACE':
      cy.getPickupPlaceDetail()
      cy.get(BTN_SUBMIT_PICKUP_PLACE).click()
  }
  cy.wait('@setShippingMethod').then(({ response }) => {
    expect(response.statusCode).to.equal(200)
  })

  cy.get(SELECTED_SHIPMENT_OPTION).should('be.visible')
})
