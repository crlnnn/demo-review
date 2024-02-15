import { shipment_name as shipment } from '../support/commands/cart/shipmentSetup'

describe('Order prep', () => {
  if (Cypress.env('locale') === 'cs') {
    it('Set up order with DPD shipment', () => {
      cy.goToRandomProductDetail()

      cy.addProductToCart()

      cy.goToCartViaProductDetailModal()

      cy.goToCartDeliveryStep()

      cy.chooseDelivery(shipment.DPD)
    })
  }
})
