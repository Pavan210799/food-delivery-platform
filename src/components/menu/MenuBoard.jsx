import Badge from '../ui/Badge'
import Photo from '../ui/Photo'
import { money } from '../../lib/format'

const COURSE_ORDER = ['Starters', 'Mains', 'Sides', 'Desserts', 'Drinks']

const diets = [
  { id: 'all', label: 'Everything' },
  { id: 'popular', label: 'Popular' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'spicy', label: 'Spicy' },
]

export default function MenuBoard({ menu, course, diet, onCourse, onDiet, onSelect }) {
  const courses = COURSE_ORDER.filter((name) => menu.some((item) => item.category === name))
  const visible = menu.filter((item) => {
    if (course !== 'All' && item.category !== course) return false
    if (diet === 'popular' && !item.popular) return false
    if (diet === 'vegetarian' && !item.vegetarian) return false
    if (diet === 'spicy' && !item.spicy) return false
    return true
  })
  const groups = COURSE_ORDER.map((category) => ({
    category,
    items: visible.filter((item) => item.category === category),
  })).filter((group) => group.items.length)

  return (
    <div>
      <div className="sticky top-16 z-30 border-y border-line bg-cream/90 backdrop-blur">
        <div className="page-wrap flex flex-col gap-3 py-3.5">
          <div
            className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1"
            role="tablist"
            aria-label="Menu courses"
          >
            {['All', ...courses].map((name) => {
              const active = course === name
              return (
                <button
                  key={name}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onCourse(name)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
                    active
                      ? 'border-ink bg-ink text-cream'
                      : 'border-line bg-paper text-ink'
                  }`}
                >
                  {name}
                </button>
              )
            })}
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-0.5" aria-label="Dietary filters">
            {diets.map((item) => {
              const active = diet === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onDiet(item.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide uppercase ${
                    active ? 'text-copper' : 'text-muted'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="page-wrap py-8">
        {groups.length === 0 ? (
          <p className="py-16 text-center font-display text-3xl">Nothing in this filter.</p>
        ) : (
          <div className="columns-1 gap-x-16 lg:columns-2">
            {groups.map((group) => (
              <section key={group.category} className="mb-10 break-inside-avoid">
                <h2 className="font-display text-3xl tracking-tight">{group.category}</h2>
                <ul className="mt-2">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(item)}
                        className="group flex w-full gap-4 rounded-3xl px-2 py-4 text-left transition duration-300 ease-out hover:bg-sand/70"
                      >
                        <Photo
                          src={item.image}
                          alt=""
                          className="h-20 w-20 shrink-0 rounded-2xl object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-3">
                            <span className="font-display text-xl leading-tight transition group-hover:text-copper">
                              {item.name}
                            </span>
                            <span className="shrink-0 text-sm tabular-nums">{money(item.price)}</span>
                          </span>
                          <span className="mt-1 block text-sm leading-5 text-muted">{item.description}</span>
                          <span className="mt-2 flex flex-wrap gap-1.5">
                            {item.popular ? <Badge tone="popular">Popular</Badge> : null}
                            {item.vegetarian ? <Badge tone="veg">Vegetarian</Badge> : null}
                            {item.spicy ? <Badge tone="spicy">Spicy</Badge> : null}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
