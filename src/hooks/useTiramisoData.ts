import { useState, useEffect, useCallback } from "react"
import { addToast } from "@heroui/toast"

const API_URL = import.meta.env.VITE_API_URL || "/api"

export function useTiramisoData() {
  const [urls, setUrls] = useState<{ path: string, confidence?: number }[]>([])
  const [query, setQuery] = useState<string>("")
  const [debounced, setDebounced] = useState(query)
  const [destroy, setDestroy] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const load = useCallback(async (query?: string, start: number = 0, count: number = 100) => {
    setLoaded(false)

    if (query) {
      const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}&start=${start}&count=${count}`)
      const json = await response.json()

      switch(json.code) {
        case 0:
          setUrls(json.items)
        break

        case 1:
          addToast({
            title: "Missing query parameter!",
            variant: "solid",
            color: "danger"
          })
        break

        default:
          addToast({
            title: "Unexpected error occured!",
            variant: "solid",
            color: "warning"
          })
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
          addToast({
            title: "Unexpected error occured!",
            variant: "solid",
            color: "warning"
          })
      }
    }

    setLoaded(true)
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

        addToast({
          title: "Successfully removed item!",
          variant: "solid",
          color: "success"
        })
      break

      case 1:
        addToast({
          title: "Not logged in!",
          variant: "solid",
          color: "danger"
        })
      break

      case 2:
        addToast({
          title: "Missing item parameter!",
          variant: "solid",
          color: "danger"
        })
      break

      case 3:
        addToast({
          title: "Item does not exist!",
          variant: "solid",
          color: "danger"
        })
      break

      default:
        addToast({
          title: "Unexpected error occured!",
          variant: "solid",
          color: "warning"
        })
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

  return { urls, query, setQuery, debounced, destroy, setDestroy, remove, load, loaded }
}