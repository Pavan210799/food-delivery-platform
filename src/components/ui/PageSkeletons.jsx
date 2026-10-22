function Bone({ className = '' }) {
  return <div className={`animate-pulse rounded-full bg-line ${className}`} />
}

function Block({ className = '' }) {
  return <div className={`animate-pulse rounded-[1.5rem] bg-sand ${className}`} />
}

export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <section className="page-wrap py-10 sm:py-14">
        <Block className="h-[min(70vh,36rem)] w-full rounded-[2rem]" />
        <div className="mt-8 max-w-xl space-y-3">
          <Bone className="h-3 w-40" />
          <Bone className="h-10 w-full max-w-md" />
          <Bone className="h-4 w-[80%]" />
          <Bone className="mt-4 h-11 w-40" />
        </div>
      </section>

      <section className="page-wrap pb-10">
        <Bone className="h-3 w-28" />
        <Bone className="mt-3 h-9 w-64" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-[1.5rem] border border-line bg-paper p-5">
              <Bone className="h-3 w-10" />
              <Bone className="mt-4 h-6 w-[66%]" />
              <Bone className="mt-3 h-3 w-full" />
              <Bone className="mt-2 h-3 w-[80%]" />
            </div>
          ))}
        </div>
      </section>

      <section className="page-wrap pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Bone className="h-3 w-24" />
            <Bone className="mt-3 h-9 w-48" />
          </div>
          <Bone className="h-10 w-36" />
        </div>
        <div className="mt-8 flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-[6.5rem] shrink-0">
              <Block className="aspect-square w-full rounded-2xl" />
              <Bone className="mt-2.5 h-3 w-16" />
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <Block className="aspect-[5/4] w-full" />
              <Bone className="mt-4 h-5 w-[66%]" />
              <Bone className="mt-2 h-3 w-1/2" />
              <Bone className="mt-2 h-3 w-full" />
            </div>
          ))}
        </div>
      </section>

      <p className="pb-10 text-center text-[0.68rem] font-semibold tracking-[0.18em] text-muted uppercase">
        Loading home
      </p>
    </div>
  )
}

export function RestaurantSkeleton() {
  return (
    <div className="page-wrap py-8 sm:py-10" aria-busy="true" aria-live="polite">
      <Block className="h-64 w-full rounded-4xl sm:h-[26rem]" />
      <div className="mt-6 max-w-xl space-y-3">
        <Bone className="h-3 w-40" />
        <Bone className="h-10 w-72 sm:w-96" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-[83%]" />
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Bone key={index} className="h-9 w-20" />
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex gap-4 rounded-3xl border border-line bg-paper p-3">
            <Block className="h-20 w-20 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-3 py-2">
              <Bone className="h-4 w-[66%]" />
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-[0.68rem] font-semibold tracking-[0.18em] text-muted uppercase">
        Loading kitchen
      </p>
    </div>
  )
}

export function RestaurantsSkeleton() {
  return (
    <div className="page-wrap py-10 sm:py-14" aria-busy="true" aria-live="polite">
      <Bone className="h-3 w-28" />
      <Bone className="mt-3 h-10 w-64 sm:w-80" />
      <Bone className="mt-3 h-4 w-full max-w-md" />
      <div className="mt-8 rounded-[1.75rem] border border-line bg-paper p-4 sm:p-5">
        <Bone className="h-3 w-36" />
        <div className="mt-4 flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-[6.5rem] shrink-0">
              <Block className="aspect-square w-full rounded-2xl" />
              <Bone className="mt-2.5 h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
      <Bone className="mt-8 h-5 w-40" />
      <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <Block className="aspect-[5/4] w-full" />
            <Bone className="mt-4 h-5 w-[66%]" />
            <Bone className="mt-2 h-3 w-1/2" />
            <Bone className="mt-2 h-3 w-full" />
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-[0.68rem] font-semibold tracking-[0.18em] text-muted uppercase">
        Loading restaurants
      </p>
    </div>
  )
}

export function CartSkeleton() {
  return (
    <div className="page-wrap py-10 sm:py-14" aria-busy="true" aria-live="polite">
      <Bone className="h-3 w-16" />
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <Bone className="h-10 w-48 sm:w-64" />
        <Bone className="h-4 w-14" />
      </div>
      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-4 rounded-[1.5rem] border border-line bg-paper p-4">
              <Block className="h-24 w-24 shrink-0 rounded-[1.1rem]" />
              <div className="min-w-0 flex-1 space-y-3 py-1">
                <Bone className="h-5 w-[70%]" />
                <Bone className="h-3 w-full" />
                <Bone className="h-3 w-[55%]" />
                <div className="flex items-center gap-3 pt-1">
                  <Bone className="h-8 w-24" />
                  <Bone className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-4xl border border-line bg-paper p-6">
          <Bone className="h-3 w-20" />
          <Bone className="mt-2 h-8 w-40" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex gap-3 rounded-2xl border border-line bg-cream p-2.5">
                <Block className="h-14 w-14 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2 py-1">
                  <Bone className="h-3 w-20" />
                  <Bone className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex justify-between gap-4">
                <Bone className="h-3 w-20" />
                <Bone className="h-3 w-14" />
              </div>
            ))}
            <div className="flex justify-between gap-4 border-t border-line pt-3">
              <Bone className="h-6 w-16" />
              <Bone className="h-6 w-20" />
            </div>
          </div>
          <Bone className="mt-6 h-11 w-full" />
        </div>
      </div>
      <p className="mt-10 text-center text-[0.68rem] font-semibold tracking-[0.18em] text-muted uppercase">
        Loading cart
      </p>
    </div>
  )
}

export function OrdersSkeleton() {
  return (
    <div className="page-wrap py-10 sm:py-14" aria-busy="true" aria-live="polite">
      <Bone className="h-3 w-24" />
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <Bone className="h-10 w-56 sm:w-72" />
        <Bone className="h-10 w-36" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[1.75rem] border border-line bg-paper p-5">
            <div className="flex gap-4">
              <Block className="h-20 w-20 shrink-0 rounded-[1.1rem]" />
              <div className="min-w-0 flex-1 space-y-3 py-1">
                <Bone className="h-3 w-24" />
                <Bone className="h-5 w-[75%]" />
                <Bone className="h-3 w-1/2" />
              </div>
            </div>
            <div className="mt-5 space-y-2 border-t border-line pt-4">
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-[80%]" />
              <Bone className="h-3 w-[66%]" />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-[0.68rem] font-semibold tracking-[0.18em] text-muted uppercase">
        Loading orders
      </p>
    </div>
  )
}
