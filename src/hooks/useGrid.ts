import { useState, useEffect, useRef } from "react"

export function useGridResize(load: () => void) {
  const gridRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const loaded = useRef(false)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    function update() {
      grid && setSize(grid.getBoundingClientRect())
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(grid)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (size.width == 0 && size.height == 0) return
    if (loaded.current) return
    loaded.current = true

    load()
  }, [size])

  return { gridRef, size }
}