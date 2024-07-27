/* eslint-disable prettier/prettier */
// Sample validation rules for a registration form
const shopRules = {
  rules: {
     name: [
      {
        pattern: /^.+$/,
        message: 'store name is required'
      },
      {
        pattern: /^.{0,50}$/,
        message: 'store name must be no more than 50 characters'
      }
    ],    
    mobile: [
      { pattern: /^.+$/, message: 'mobile number is required' },
      {
        pattern: /^.{0,20}$/,
        message: 'mobile number must be no more than 20 characters',
      },
    ],
     address: [
      { pattern: /^.+$/, message: 'address is required' },
      {
        pattern: /^.{0,100}$/,
        message: 'address must be no more than 100 characters',
      },
    ],
    email: [
      { pattern: /.+/, message: 'email address is required' },
      {
        pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        message: 'Please enter a valid email address',
      },
      {
        pattern: /^.{0,50}$/,
        message: 'email address must be no more than 50 characters',
      },
    ],      
  },
  fields: {  
    name: "",   
    email: "",   
    mobile: '',    
    address: '' , 
    currency : '£',  
    description : ''
  }
}

export { shopRules }