const tones = {
  popular: 'bg-ink text-cream',
  veg: 'bg-sage/10 text-sage',
  spicy: 'bg-copper/10 text-copper-dark',
  offer: 'bg-sand text-ink',
  quiet: 'bg-paper text-ink',
}

export default function Badge({ tone = 'quiet', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.14em] uppercase ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
