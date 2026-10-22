const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const number = new Intl.NumberFormat('en-US')

export function money(value) {
  return currency.format(value)
}

export function count(value) {
  return number.format(value)
}

export function roundMoney(value) {
  return Math.round(value * 100) / 100
}
