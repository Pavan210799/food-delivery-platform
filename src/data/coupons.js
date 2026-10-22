export const coupons = [
  {
    code: 'WELCOME15',
    label: '15% off the food subtotal',
    type: 'percent',
    value: 15,
    minSubtotal: 25,
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=75',
  },
  {
    code: 'MARLOW10',
    label: '$10 off the food subtotal',
    type: 'flat',
    value: 10,
    minSubtotal: 40,
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=75',
  },
  {
    code: 'FREESHIP',
    label: 'Delivery is on the house',
    type: 'delivery',
    value: 100,
    minSubtotal: 10,
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=75',
  },
]
