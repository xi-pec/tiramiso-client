import { useState, useEffect } from "react"
import { useDisclosure } from "@heroui/modal"

const API_URL = import.meta.env.VITE_API_URL || ""

export function useUploader(load: (query?: string) => void, query: string) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [allowed, setAllowed] = useState(false)

  async function upload(file: File) {
    if (!file) return

    const formdata = new FormData()
    formdata.append("item", file)

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formdata,
      credentials: "include"
    })

    const json = await response.json()

    switch(json.code) {
      case 0:
        query ? load(query) : load()
        return true
      break

      case 1:
        console.log("no file uploaded")
      break

      case 2:
        console.log("file not allowed")
      break

      case 3:
        console.log("file already exists")
      break

      default:
        console.log("??")
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return

    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
  }

  function handleClose() {
    setFile(null)
    setPreview(null)
  }

  function handleUpload(cb: () => any) {
    if (file) {
      setAllowed(false)

      return upload(file)
        .then((success) => {
          setAllowed(true)
          if (success) cb()
          return success
        })
    }
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  useEffect(() => {
    setAllowed(!!file)
  }, [file])

  return { isOpen, onOpen, onOpenChange, handleClose, preview, allowed, handleChange, handleUpload }
}