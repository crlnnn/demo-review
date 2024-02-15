import randomElement from '../utilities/randomElement'

Cypress.Commands.add('goToRandomCategory', () => {
  const ES_URL_RESOLVER = '**/urlres?query=query(*urlResolver*'
  const ES_CATEGORY_LOAD = '**/_e?index=drmax_frontend_category_1**'

  cy.intercept('GET', ES_URL_RESOLVER).as('graphqlCategoryLoad')
  cy.intercept('GET', ES_CATEGORY_LOAD).as('elasticsearchCategoryLoad')

  // I assume selector "isHighlighted" is used for collectionType and not categoryType product listing
  // collectionType selector could be used for testing specified product list (ex. sale listing)
  const SUBMENU_ITEM = '#submenu-1 a[role="menuitem"]:not(.isHighlighted)'
  const MODAL_ICON_CLOSE = '.row-buttons > .btn-outline-primary'
  randomElement(SUBMENU_ITEM)

  // Modal window (age restricted content) -> skip category
  if (Cypress.env('url').icognitoTabMode) {
    cy.get(MODAL_ICON_CLOSE)
    cy.goToRandomCategory()
  }

  cy.wait('@graphqlCategoryLoad')
  // Server response timeout
  cy.wait('@elasticsearchCategoryLoad', { timeout: 20000 })
})
