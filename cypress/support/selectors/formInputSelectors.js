export const formSelectors = {
  formContact: '[data-test-id="checkout-contact-information-wrapper"]',
  billingAddress: '[data-test-id="checkout-billing-information-wrapper"]',
  deliveryAddress: '[data-test-id="checkout-shipping-information-wrapper"]',
}

export const formNames = {
  contact: 'formContact',
  billingAddress: 'billingAddress',
  deliveryAddress: 'deliveryAddress',
}

export const formFields = {
  email: {
    selector: 'input[type="email"][id="email"]',
    action: 'type',
  },
  firstname: {
    selector: 'input[type="text"][id="firstname"]',
    action: 'type',
  },
  lastname: {
    selector: 'input[type="text"][id="lastname"]',
    action: 'type',
  },
  phoneNumber: {
    selector: 'input[type="text"][id="phoneNumber"]',
    action: 'type',
  },
  note: {
    selector: 'textarea[id="customerNotes"]',
    action: 'type',
  },
  billingStreet: {
    selector: 'input[type="text"][id="billing__street"]',
    action: 'type',
  },
  billingPostcode: {
    selector: 'input[type="text"][id="billing__postcode"]',
    action: 'type',
  },
  billingCity: {
    selector: 'input[type="text"][id="billing__city"]',
    action: 'type',
  },
  street: {
    selector: 'input[type="text"][id="street"]',
    action: 'type',
  },
  postcode: {
    selector: 'input[type="text"][id="postcode"]',
    action: 'type',
  },
  city: {
    selector: 'input[type="text"][id="city"]',
    action: 'type',
  },
}
