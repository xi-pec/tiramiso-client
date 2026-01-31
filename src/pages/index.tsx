import DefaultLayout from "@/layouts/default";

import { useState, useEffect, useRef } from "react";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input"
import { Switch } from "@heroui/switch";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@heroui/modal";
import { Button } from "@heroui/button"
import { Divider } from "@heroui/divider"

export default function IndexPage() {
  const gridRef = useRef<HTMLDivElement | null>(null)

  const [size, setSize] = useState({ width: 0, height: 0 })
  const [urls, setUrls] = useState<string[]>([])
  const [query, setQuery] = useState<string>("")
  const [debounced, setDebounced] = useState(query)
  const [destroy, setDestroy] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [allowed, setAllowed] = useState(false)
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  async function load(query?: string, start: number = 0, count: number = 100) {
    if (query) {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&start=${start}&count=${count}`)
      const json = await response.json()

      switch(json.code) {
        case 0:
          setUrls(json.items
            .map((item: { path: string, confidence: number }) => {
              return item.confidence >= 0.25 ? item.path : null
            })
            .filter((url: string | null) => url)
          )
        break

        case 1:
          console.log("missing query")
        break

        default:
          console.log("??")
      }
    } else {
      const response = await fetch(`/api/list`)
      const json = await response.json()

      switch(json.code) {
        case 0:
          setUrls(json.items)
        break

        default:
          console.log("??")
      }
    }
  }

  async function upload(file: File) {
    if (!file) return

    const formdata = new FormData()
    formdata.append("item", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formdata
    })

    const json = await response.json()

    switch(json.code) {
      case 0:
        load()
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

  async function remove(item: string) {
    const response = await fetch("/api/remove", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ item })
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
        2})
    }
  }

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    function update() {
      grid && setSize(grid.getBoundingClientRect())
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(grid)

    return () => observer.disconnect()
  }, [])

  const loaded = useRef(false)
  useEffect(() => {
    if (size.width == 0 && size.height == 0) return
    if (loaded.current) return
    loaded.current = true

    load()
  }, [size])

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(query), 500)
    return () => clearTimeout(handler)
  }, [query])

  useEffect(() => {
    if (debounced) load(debounced)
    else load()
  }, [debounced])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  useEffect(() => {
    setAllowed(!!file)
  }, [file])

  return (
    <DefaultLayout>
      <div className="flex flex-col h-full min-h-0 ml-4 mr-4">
        <div className="mb-6">
          <h1 className="w-full text-7xl text-center font-bold text-primary font-[Larken]">TIRAMISO</h1>
          <h2 className="w-full text-3xl text-center font-light text">Transformer-based Item Recognition for Actively Missing Objects</h2>
        </div>
        
        <div className="grid sm:grid-cols-[1fr_auto] gap-4 m-4">
          <Input
            placeholder="Search"
            startContent={
              <svg className="w-6 h-6" fill="#606060" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"/></svg>
            }
            value={query}
            onValueChange={setQuery}
          />

          <Switch color="danger" className="place-self-center" isSelected={destroy} onValueChange={setDestroy}>Remove Mode</Switch>
        </div>

        <Divider />

        <div ref={gridRef} className="flex-1 min-h-0 overflow-y-auto grid grid-cols-[repeat(auto-fit,150px)] auto-rows-[150px] gap-4 justify-center box-border m-4">
          <Image
            isZoomed
            className="p-12 bg-default-200"
            src={`data:image/svg+xml;utf8,${encodeURIComponent(`<svg fill="#606060" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>`)}`}
            width={150}
            height={150}
            onClick={onOpen}
          />
          
          {
            urls.map((url, key) => {
              return <Image
                key={key}
                isZoomed
                src={url}
                width={150}
                height={150}
                onClick={() => destroy && remove(url.split("/").pop()!)}
              />
            })
          }
        </div>
      </div>

      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange} onClose={handleClose}>
        <ModalContent>
          {(onClose) => <>
            <ModalHeader>Upload Item</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2 w-full aspect-square">
                <label className="relative block w-full h-full rounded-md cursor-pointer overflow-hidden">
                  {preview ? (
                    <Image
                      src={preview}
                      className="w-full h-full object-cover"
                      isZoomed
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-gray-400">
                      Click to select image
                    </span>
                  )}
                  <Input
                    type="file"
                    accept=".png,.jpg"
                    name="item"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleChange}
                  />
                </label>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button isDisabled={!allowed} color="primary" onPress={() => { handleUpload(onClose) } }>Upload</Button>
            </ModalFooter>
          </>}
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}