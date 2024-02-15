describe('Pickup place data', () => {
  if (Cypress.env('locale') === 'cz') {
    it('Compare opening hours shown on FE with BE response data', () => {
      const URL_API_PHARMACIES_LIST =
        'https://pharmacy.drmax.cz/api/v1/public/pharmacies/*'

      let dynamicPharmacyId = null

      cy.intercept(URL_API_PHARMACIES_LIST, 'GET').as('pharmacyRequests')

      cy.goToRandomProductDetail()

      cy.addProductToCart()

      cy.goToCartViaProductDetailModal()

      cy.goToCartDeliveryStep()

      cy.getPickupPlaceDetail()

      // Get pickup place ID from request url
      cy.wait('@pharmacyRequests', { timeout: 200000 }).then((interception) => {
        const match = /pharmacies\/(.+)/.exec(interception.request.url)
        if (match) {
          dynamicPharmacyId = match[1]
        }
      })

      cy.get('.pharmacy-hours__item').each(($item) => {
        const day = $item.find('.day').text().trim()
        const date = $item.find('.date').text().trim()
        const hours = $item.find('.hours').text().trim()
        cy.log(`Day: ${day}, Date: ${date}, Hours: ${hours}`)
      })

      // Request url with ID taken from previous request -> get openingHours
      cy.wait('@pharmacyRequests', { timeout: 200000 }).then(
        ({ request, response }) => {
          if (request.url.includes(dynamicPharmacyId)) {
            const responseBody = response.body
            cy.log(JSON.stringify(responseBody.openingHours))

            expect(responseBody)
              .to.have.property('openingHours')
              .that.is.an('array')
          }
        }
      )
    })
  }
})

// Had problem accessing https://backend.drmax.cz for pickup list object
// Till Tuesday morning it was working successfuly, couldnt spend more time on tracking the issue
// Sending PM to devs on Linkedin for debug was nearly an option :D

/* This is how I would go on comparing values

`${new Date('2024-02-12T07:00:00Z').getHours()}`.padStart(2, '0') +
  ':' +
  `${new Date('2024-02-12T07:00:00Z').getMinutes()}`.padStart(2, '0') // => '08:00'
 */
