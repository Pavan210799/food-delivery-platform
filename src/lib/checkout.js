export const emptyCheckout = {
  name: '',
  phone: '',
  address: '',
}

export function validateCheckout(values) {
  const errors = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Enter your name.'
  }

  const phoneDigits = values.phone.replace(/\D/g, '')
  if (phoneDigits.length < 10) {
    errors.phone = 'Enter a valid phone number.'
  }

  if (values.address.trim().length < 8) {
    errors.address = 'Enter a delivery address.'
  }

  return errors
}
