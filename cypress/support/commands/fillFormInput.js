import { formSelectors, formFields } from '../selectors/formInputSelectors'

Cypress.Commands.add('fillForm', (formName, formData) => {
  const formSelector = formSelectors[formName]

  if (!formSelector) {
    throw new Error(`Form selector for '${formName}' is not defined.`)
  }

  cy.get(formSelector).within(() => {
    Object.entries(formData).forEach(([key, value]) => {
      const field = formFields[key]

      if (!field) {
        throw new Error(`Field '${key}' is not defined in form fields.`)
      }

      const { selector, action } = field

      switch (action) {
        case 'type':
          cy.get(selector).click().clear().type(value)
          break
        case 'check':
          cy.get(selector).check({ force: true })
          break
      }
    })
  })
})


