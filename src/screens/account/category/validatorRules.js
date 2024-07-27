/* eslint-disable prettier/prettier */
// Sample validation rules for a registration form
const reset = {
  name: "",
  color_code: "",
  status: 0,
}
const categoryRules = {
  rules: {
    name: [
      {
        pattern: /^.+$/,
        message: 'category name is required'
      },
      {
        pattern: /^.{0,50}$/,
        message: 'category name must be no more than 50 characters'
      }
    ]
  },
  reset: reset,
  fields: {
    ...reset
  }
}

export { categoryRules }