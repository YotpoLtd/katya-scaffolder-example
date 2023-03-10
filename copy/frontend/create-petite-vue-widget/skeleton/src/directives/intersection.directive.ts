const Intersection = (ctx: any) => {
  ctx.effect(() => {
    const callback = ctx.get().callback
    const observer = new IntersectionObserver(
      (entries) => {
        const validEntry = entries.find((intersectionObserverEntry) => intersectionObserverEntry.isIntersecting || intersectionObserverEntry.intersectionRatio > 0)
        if (validEntry) {
          callback()
          observer.disconnect()
        }
      },
      { threshold: [0] },
    )
    const element = ctx.el ? (ctx.el as HTMLElement) : null
    if (!element) {
      return
    }
    observer.observe(element)
  })
}

export default Intersection
