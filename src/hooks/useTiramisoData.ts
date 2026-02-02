import { useState, useEffect, useCallback } from "react"

const API_URL = import.meta.env.VITE_API_URL || "/api"

export function useTiramisoData() {
  const [urls, setUrls] = useState<{ path: string, confidence?: number }[]>([])
  const [query, setQuery] = useState<string>("")
  const [debounced, setDebounced] = useState(query)
  const [destroy, setDestroy] = useState(false)

  const load = useCallback(async (query?: string, start: number = 0, count: number = 100) => {
    if (query) {
      const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}&start=${start}&count=${count}`)
      const json = await response.json()

      switch(json.code) {
        case 0:
          setUrls(json.items)
        break

        case 1:
          console.log("missing query")
        break

        default:
          console.log("??")
      }
    } else {
      const response = await fetch(`${API_URL}/list`)
      const json = await response.json()

      switch(json.code) {
        case 0:
          setUrls(json.items
            .map((url: any) => {
              return { path: url }
            })
          )
        break

        default:
          console.log("??")
      }
    }
  }, [])

  async function remove(item: string) {
    const response = await fetch(`${API_URL}/remove`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ item }),
      credentials: "include"
    })

    const json = await response.json()

    switch(json.code) {
      case 0:
        if (debounced) load(debounced)
        else load()
      break

      case 1:
        console.log("missing item arg")
      break

      case 2:
        console.log("does not exist")
      break

      default:
        console.log("??")
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(query), 500)
    return () => clearTimeout(handler)
  }, [query])

  useEffect(() => {
    if (debounced) load(debounced)
    else load()
  }, [debounced])

  return { urls, query, setQuery, debounced, destroy, setDestroy, remove, load }
}