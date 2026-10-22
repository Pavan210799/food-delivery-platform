import { money } from '../../lib/format'
import { selectionLabel } from '../../lib/lines'
import { unitPrice } from '../../lib/pricing'
import Photo from '../ui/Photo'
import Quantity from '../ui/Quantity'

export default function CartLine({ item, onQuantity, onRemove }) {
  const label = selectionLabel(item)
  const each = unitPrice(item)

  return (
    <article className="flex gap-4 border-b border-line py-5">
      <Photo src={item.image} alt="" className="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-24" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-tight">{item.name}</h3>
          <p className="shrink-0 text-sm tabular-nums">{money(each * item.quantity)}</p>
        </div>
        {label ? <p className="mt-1 text-sm leading-5 text-muted">{label}</p> : null}
        <p className="mt-1 text-xs text-muted">{money(each)} each</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <Quantity value={item.quantity} onChange={(value) => onQuantity(item.lineId, value)} />
          <button type="button" onClick={() => onRemove(item.lineId)} className="text-sm text-muted hover:text-danger">
            Remove
          </button>
        </div>
      </div>
    </article>
  )
}
