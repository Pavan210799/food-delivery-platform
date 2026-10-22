import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { money } from '../../lib/format'
import Button from '../ui/Button'
import { CloseIcon } from '../ui/Icons'
import Photo from '../ui/Photo'
import Quantity from '../ui/Quantity'

function initialChoices(groups = []) {
  const choices = {}
  for (const group of groups) {
    if (group.type === 'multiple') {
      choices[group.id] = group.options.filter((option) => option.default).map((option) => option.id)
    } else {
      const fallback = group.required ? group.options[0] : null
      const selected = group.options.find((option) => option.default) ?? fallback
      choices[group.id] = selected ? selected.id : null
    }
  }
  return choices
}

function chosenIds(value) {
  if (Array.isArray(value)) return value
  return value ? [value] : []
}

function extrasFor(item, choices) {
  return (item.customizations ?? []).reduce((sum, group) => {
    const ids = chosenIds(choices[group.id])
    return (
      sum +
      group.options.filter((option) => ids.includes(option.id)).reduce((extra, option) => extra + option.price, 0)
    )
  }, 0)
}

function toSelections(item, choices) {
  const selections = []
  for (const group of item.customizations ?? []) {
    const ids = chosenIds(choices[group.id])
    for (const option of group.options) {
      if (!ids.includes(option.id)) continue
      selections.push({
        groupId: group.id,
        groupName: group.name,
        optionId: option.id,
        optionName: option.name,
        price: option.price,
      })
    }
  }
  return selections
}

function groupErrors(groups, choices) {
  const errors = {}
  for (const group of groups) {
    if (group.required && chosenIds(choices[group.id]).length === 0) {
      errors[group.id] = `Select ${group.name.toLowerCase()}.`
    }
  }
  return errors
}

export default function CustomizeDialog({ restaurant, item, onClose }) {
  const { addItem, pending, items } = useCart()
  const [choices, setChoices] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({})
  const waitingForSwitch = useRef(false)
  const itemId = item?.id ?? null
  const [trackedId, setTrackedId] = useState(itemId)
  if (itemId !== trackedId) {
    setTrackedId(itemId)
    setChoices(item ? initialChoices(item.customizations) : {})
    setQuantity(1)
    setNote('')
    setErrors({})
  }

  useEffect(() => {
    if (!item) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  const unit = item ? item.price + extrasFor(item, choices) : 0
  const total = unit * quantity
  const groups = item?.customizations ?? []

  function toggleMultiple(group, optionId) {
    setChoices((prev) => {
      const current = chosenIds(prev[group.id])
      if (current.includes(optionId)) {
        return { ...prev, [group.id]: current.filter((id) => id !== optionId) }
      }
      if (group.max && current.length >= group.max) return prev
      return { ...prev, [group.id]: [...current, optionId] }
    })
    setErrors((prev) => ({ ...prev, [group.id]: undefined }))
  }

  function selectSingle(group, optionId) {
    setChoices((prev) => ({ ...prev, [group.id]: optionId }))
    setErrors((prev) => ({ ...prev, [group.id]: undefined }))
  }

  function add() {
    const nextErrors = groupErrors(groups, choices)
    if (note.trim().length > 140) nextErrors.note = 'Keep the note under 140 characters.'
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    const result = addItem({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      itemId: item.id,
      name: item.name,
      image: item.image,
      basePrice: item.price,
      quantity,
      selections: toSelections(item, choices),
      note,
    })
    if (result === 'added') onClose()
    else waitingForSwitch.current = true
  }

  useEffect(() => {
    if (!waitingForSwitch.current || pending || !item) return
    const added = items.some((line) => line.itemId === item.id && line.restaurantId === restaurant.id)
    waitingForSwitch.current = false
    if (added) onClose()
  }, [pending, items, item, restaurant, onClose])

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" className="absolute inset-0 bg-ink/55" aria-label="Close customization" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customize-title"
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 28, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[1.75rem] bg-paper shadow-2xl sm:max-w-lg sm:rounded-[1.75rem]"
          >
            <div className="relative h-48 shrink-0 bg-sand sm:h-56">
              <Photo src={item.image} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper/95 text-ink"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-copper uppercase">{restaurant.name}</p>
              <div className="mt-1 flex items-start justify-between gap-4">
                <h2 id="customize-title" className="font-display text-3xl tracking-tight">
                  {item.name}
                </h2>
                <p className="pt-1 text-sm tabular-nums">{money(item.price)}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>

              <div className="mt-6 space-y-6">
                {groups.map((group) => {
                  const selected = chosenIds(choices[group.id])
                  const atMax = group.type === 'multiple' && group.max && selected.length >= group.max
                  return (
                    <fieldset key={group.id}>
                      <legend className="flex w-full items-baseline justify-between gap-3">
                        <span className="text-sm font-semibold">{group.name}</span>
                        <span className="text-xs text-muted">
                          {group.required ? 'Required' : 'Optional'}
                          {group.max ? ` · up to ${group.max}` : ''}
                        </span>
                      </legend>
                      <div className="mt-3 space-y-2">
                        {group.options.map((option) => {
                          const checked = selected.includes(option.id)
                          const disabled = !checked && atMax
                          return (
                            <label
                              key={option.id}
                              className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-sm ${
                                checked ? 'border-ink bg-cream' : 'border-line'
                              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                              <span className="flex items-center gap-3">
                                <input
                                  type={group.type === 'multiple' ? 'checkbox' : 'radio'}
                                  name={group.id}
                                  checked={checked}
                                  disabled={disabled}
                                  onChange={() =>
                                    group.type === 'multiple'
                                      ? toggleMultiple(group, option.id)
                                      : selectSingle(group, option.id)
                                  }
                                  className="accent-ink"
                                />
                                {option.name}
                              </span>
                              <span className="tabular-nums text-muted">
                                {option.price > 0 ? `+${money(option.price)}` : 'Included'}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                      {errors[group.id] ? <p className="mt-2 text-sm text-danger">{errors[group.id]}</p> : null}
                    </fieldset>
                  )
                })}

                <label className="block">
                  <span className="text-sm font-semibold">Note for the kitchen</span>
                  <textarea
                    value={note}
                    maxLength={140}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Allergies, no onion, leave at the door…"
                    className="mt-3 w-full resize-none rounded-2xl border border-line bg-cream px-4 py-3 text-base outline-none focus:border-ink"
                    rows={3}
                  />
                  <span className="mt-1 block text-xs text-muted">{note.length}/140</span>
                  {errors.note ? <span className="mt-1 block text-sm text-danger">{errors.note}</span> : null}
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-line px-5 py-4 sm:px-6">
              <Quantity value={quantity} onChange={setQuantity} />
              <Button variant="primary" className="flex-1" onClick={add}>
                Add {money(total)}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
