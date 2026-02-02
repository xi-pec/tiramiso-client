import { useState, useEffect } from "react"
import { useDisclosure } from "@heroui/modal"
import { addToast } from "@heroui/toast"

const API_URL = import.meta.env.VITE_API_URL || "/api"

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

        addToast({
          title: "Successfully uploaded item!",
          variant: "solid",
          color: "success"
        })

        return true
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
          title: "File is missing!",
          variant: "solid",
          color: "danger"
        })
      break

      case 3:
        addToast({
          title: "File type is not allowed!",
          variant: "solid",
          color: "danger"
        })
      break

      case 4:
        addToast({
          title: "File already exists!",
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