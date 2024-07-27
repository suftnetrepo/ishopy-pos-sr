/* eslint-disable prettier/prettier */
// Sample validation rules for a registration form
const validatorRules = {
  rules: {
    user_name: [
      {
        pattern: /^.+$/,
        message: 'user name is required'
      },
      {
        pattern: /^.{0,50}$/,
        message: 'user name must be no more than 50 characters'
      }
    ],
    password: [
			{ pattern: /^.+$/, message: 'password is required' },
      {
        pattern: /^.{0,50}$/,
        message: 'password must be no more than 50 characters'
      }
    ]   
  },
  fields: {  
    user_name: '',   
    password: ''
  }
}

export { validatorRules }