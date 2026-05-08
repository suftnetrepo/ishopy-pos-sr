const addOnRules = {
  rules: {
    addOnName: [
      {
        pattern: /^.+$/,
        message: 'addon name is required',
      },
      {
        pattern: /^.{0,50}$/,
        message: 'addon name must be no more than 50 characters',
      },
    ],
    price: [
      {
        pattern: /^.+$/,
        message: 'price is required',
      },
      {
        pattern: /^.{0,50}$/,
        message: 'price must be no more than 50 characters',
      },
    ],
  },
  reset :() => {  
    return {
      addOnName: '',
      price: '',  
      status : 1,
      addOn_id: '',
      group_id: '',
      }
  },
  fields: {
    addOnName: '',
    price: '',
    status : 1,
    addOn_id: '',
    group_id: '',
  },
};

export {addOnRules};
