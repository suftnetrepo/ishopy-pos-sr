/* eslint-disable prettier/prettier */
// Sample validation rules for a registration form

const reset = {
  first_name: "",
  last_name: "",
  username: "",
  password: '',
  role: 'admin',
  pass_code: '1234'
}
const userRules = {
  rules: {
    first_name: [
      {
        pattern: /^.+$/,
        message: 'firstname is required'
      },
      {
        pattern: /^.{0,50}$/,
        message: 'firstname must be no more than 50 characters'
      }
    ],
    last_name: [
      {
        pattern: /^.+$/,
        message: 'lastname is required'
      },
      {
        pattern: /^.{0,50}$/,
        message: 'lastname must be no more than 50 characters'
      }
    ],
    user_name: [
      {
        pattern: /^.+$/,
        message: 'username is required'
      },
      {
        pattern: /^.{0,20}$/,
        message: 'username must be no more than 50 characters'
      }
    ],
    password: [
      { pattern: /^.+$/, message: 'password is required' },
      {
        pattern: /^.{0,20}$/,
        message: 'password must be no more than 50 characters'
      }
    ]
  },
  reset: reset,
  fields: {
    ...reset
  }
}

export { userRules }