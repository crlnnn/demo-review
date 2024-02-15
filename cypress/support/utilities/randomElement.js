/**
 * @param {string} element - The CSS selector used to identify the group of elements
 *                           A random element from this set will be clicked
 */

const randomElement = (element) => {
  cy.get(element)
    .should('be.visible')
    .its('length')
    .then((numLinks) => {
      const num = Math.floor(Math.random() * numLinks)
      cy.get(element).eq(num).click()
    })
}

export default randomElement
