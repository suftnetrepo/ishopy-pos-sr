/* eslint-disable prettier/prettier */
// Sample validation rules for a registration form
const reset = {
  name: "",
  rate: "",
  status: 0
}
const discountRules = {
  rules: {
    name: [
      {
        pattern: /^.+$/,
        message: 'discount name is required'
      },
      {
        pattern: /^.{0,50}$/,
        message: 'discount name must be no more than 50 characters'
      }
    ],
    rate: [
      { pattern: /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/, message: 'discount rate is required' },
      {
        pattern: /^.{0,9}$/,
        message: 'rate must be no more than 9 characters'
      }
    ]
  },
  reset: reset,
  fields: {
    ...reset
  }
}

export { discountRules }