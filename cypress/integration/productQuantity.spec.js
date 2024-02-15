function waitForGraphQlUpdateCartItems(expectedQuantity) {
  // Server response timeout
  cy.wait('@updateCartItems', { timeout: 200000 }).then(({ response }) => {
    expect(response.statusCode).to.equal(200)
    expect(response.body).to.have.nested.property('data.updateCartItems.cart')
    expect(response.body.data.updateCartItems.cart.items).to.be.an('array').that
      .is.not.empty
    expect(response.body.data.updateCartItems.cart.items[0].quantity).to.equal(
      expectedQuantity
    )
  })
}

function waitForGraphQlRemoveCartItems() {
  // Server response timeout
  cy.wait('@removeItemFromCart', { timeout: 200000 }).then(({ response }) => {
    expect(response.statusCode).to.equal(200)
    expect(response.body).to.have.nested.property(
      'data.removeItemFromCart.cart'
    )
    expect(response.body.data.removeItemFromCart.cart.items).to.be.an('array')
      .that.is.empty
  })
}

describe('Quantity change in 1st cart step', () => {
  const INPUT_QUANTITY = '[data-test-id="checkout-product-quantity-input"]'
  const BTN_QUANTITY_INCREASE =
    '[data-test-id="checkout-product-quantity-increase-button"]'

  beforeEach(() => {
    cy.intercept('POST', Cypress.env('url').graphQL, (req) => {
      if (req.body.operationName === 'updateCartItems') {
        req.alias = 'updateCartItems'
      }
    })

    cy.goToRandomProductDetail()
    cy.addProductToCart()
    cy.goToCartViaProductDetailModal()

    cy.get(INPUT_QUANTITY).should('have.value', '1')
  })

  it('Increase quantity via btn works correctly', () => {
    cy.get(INPUT_QUANTITY).click().clear().type('2{enter}')
    waitForGraphQlUpdateCartItems(2)
  })

  it('Increase quantity via input works correctly', () => {
    cy.get(BTN_QUANTITY_INCREASE).click()
    waitForGraphQlUpdateCartItems(2)
  })

  describe('Decrease quantity after increase', () => {
    beforeEach(() => {
      cy.get(INPUT_QUANTITY).click().clear().type('2{enter}')
      waitForGraphQlUpdateCartItems(2)
    })

    it('Decrease quantity via button works correctly', () => {
      const BTN_QUANTITY_DECREASE =
        '[data-test-id="checkout-product-quantity-decrease-button"]'

      cy.get(BTN_QUANTITY_DECREASE).click()
      waitForGraphQlUpdateCartItems(1)
    })

    it('Decrease quantity via text input works correctly', () => {
      cy.get(INPUT_QUANTITY).click().clear().type('1{enter}')
      waitForGraphQlUpdateCartItems(1)
    })
  })

  describe('Remove product from cart', () => {
    it('Remove product from cart', () => {
      cy.intercept('POST', Cypress.env('url').graphQL, (req) => {
        if (req.body.operationName === 'removeItemFromCart') {
          req.alias = 'removeItemFromCart'
        }
      })

      const BTN_REMOVE_PRODUCT =
        '[data-test-id="checkout-product-remove-button"]'
      const DIALOG_MODAL = '.modal-dialog'
      const BTN_SUCCESS = '.btn-success'

      cy.get(BTN_REMOVE_PRODUCT).click()

      cy.get(DIALOG_MODAL)
        .should('be.visible')
        .then(($dialog) => {
          cy.wrap($dialog).find(BTN_SUCCESS).should('be.visible').click()
        })

      waitForGraphQlRemoveCartItems()
    })
  })
})
