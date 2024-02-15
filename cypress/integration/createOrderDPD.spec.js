import { shipment_name as shipment } from '../support/commands/cart/shipmentSetup'
import { formNames as form } from '../support/selectors/formInputSelectors'

describe('Order prep', () => {
  if (Cypress.env('locale') === 'cz') {
    it('Set up order with DPD shipment', () => {
      cy.intercept('POST', Cypress.env('url').graphQL, (req) => {
        if (req.body.operationName === 'setPaymentMethodOnCart') {
          req.alias = 'setPaymentMethodOnCart'
        }
      })

      const PAYMENT_ON_DELIVERY =
        '[data-test-id="checkout-payment-option-wrapper-cashondelivery"]'

      const CHECKBOX_DELIVERY_ADDRESS =
        '[data-test-id="checkout-add-shipping-information-link"]'

      cy.goToRandomProductDetail()

      cy.addProductToCart()

      cy.goToCartViaProductDetailModal()

      cy.goToCartDeliveryStep()

      cy.chooseDelivery(shipment.DPD)

      // Payment options I would store in similar way like shipment (see shipmentSetup.js)
      cy.get(PAYMENT_ON_DELIVERY).click()
      // Server response timeout
      cy.wait('@setPaymentMethodOnCart', { timeout: 200000 })

      cy.goToCartAddressStep()

      const contactFormData = {
        firstname: 'TEST',
        lastname: 'TEST',
        email: 'HIRE@ME.NOREGRETS.CZ',
        phoneNumber: '999888777',
        note: '(づ｡◕‿‿◕｡)づ',
      }

      cy.fillForm(form.contact, contactFormData)

      const billingFormData = {
        billingStreet: 'Prosecká 855/68',
        billingPostcode: '19000',
        billingCity: 'Praha 9-Prosek',
      }

      cy.fillForm(form.billingAddress, billingFormData)

      cy.get(CHECKBOX_DELIVERY_ADDRESS).should('be.visible').click()

      const deliveryFormData = {
        street: 'Prosecká 855/67',
        postcode: '19000',
        city: 'Praha 9-Prosek',
      }

      cy.fillForm(form.deliveryAddress, deliveryFormData)
    })
  }
})
