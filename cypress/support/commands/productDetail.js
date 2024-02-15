import randomElement from '../utilities/randomElement'

Cypress.Commands.add('goToRandomProductDetail', () => {
  cy.intercept('GET', '**/_e?index=drmax_frontend_product_attachment_1**').as(
    'esProductAttachments'
  )

  const PRODUCT_GRID = '[data-test-id="product_grid"]'
  const PRODUCT_TILE_CATALOG =
    'li[data-test-id="category-tile-product"].tile--catalog a'
  const MODAL_WINDOW_CLOSE = "[use='#close']"
  const MODAL_LOGIN_DIALOG = '.login-modal-dialog'
  const PRODUCT_DETAIL = '.pr-detail'

  cy.goToRandomCategory()

  cy.get(PRODUCT_GRID).should('be.visible')

  randomElement(PRODUCT_TILE_CATALOG)

  // Login modal is visible randomly, by my analysis looks like it has somtehing to do w/ category "health"
  cy.get('body').then(($body) => {
    if ($body.find(MODAL_LOGIN_DIALOG).length) {
      cy.get(MODAL_LOGIN_DIALOG).find(MODAL_WINDOW_CLOSE).click()
    }
  })

  cy.get(PRODUCT_DETAIL).should('be.visible')
  cy.wait('@esProductAttachments')
})

Cypress.Commands.add('addProductToCart', () => {
  cy.intercept('POST', Cypress.env('url').graphQL, (req) => {
    if (req.body.operationName === 'addSimpleProductsToCart') {
      req.alias = 'addProductToCart'
    }
  })

  const BTN_ADD_TO_CART =
    '.box-add-to-cart [data-test-id="product-add-to-cart-button"]'

  cy.get(BTN_ADD_TO_CART).should('be.visible').click()
  // Server response timeout
  cy.wait('@addProductToCart', { timeout: 200000 }).then(({ response }) => {
    expect(response.statusCode).to.equal(200)
    expect(response.body).to.have.nested.property(
      'data.addSimpleProductsToCart.cart'
    )
    expect(response.body.data.addSimpleProductsToCart.cart.items).to.be.an(
      'array'
    ).that.is.not.empty
  })
})
