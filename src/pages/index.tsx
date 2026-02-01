import DefaultLayout from "@/layouts/default"
import { Image } from "@heroui/image"
import { Divider } from "@heroui/divider"
import { useState } from "react"

import { useTiramisoData } from "@/hooks/useTiramisoData"
import { useUploader } from "@/hooks/useUploader"
import { useAuth } from "@/hooks/useAuth"
import { useGridResize } from "@/hooks/useGrid"
import { Header } from "@/components/Header"
import { Controls } from "@/components/Controls"
import { UploadModal } from "@/components/UploadModal"
import { LoginModal } from "@/components/LoginModal"


export default function IndexPage() {
  const { urls, query, setQuery, destroy, setDestroy, remove, load, debounced } = useTiramisoData()
  const uploader = useUploader(load, query)
  const auth = useAuth()
  const { gridRef } = useGridResize(load)
  const [confidence, setConfidence] = useState(0.25)

  return (
    <DefaultLayout>
      <div className="flex flex-col h-full min-h-0 ml-4 mr-4">
        <div className="pt-4">
          <Header auth={auth}/>  
        </div>

        <div className="mb-6">
          <h1 className="w-full text-5xl sm:text-7xl text-center font-bold text-primary font-[Larken]">TIRAMISO</h1>
          <h2 className="w-full text-xl sm:text-3xl text-center font-light text">Transformer-based Item Recognition for Actively Missing Objects</h2>
        </div>
        
        <Controls 
          query={query} 
          setQuery={setQuery} 
          destroy={destroy} 
          setDestroy={setDestroy}
          confidence={confidence}
          setConfidence={setConfidence}
          debounced={debounced}
          auth={auth}
        />

        <Divider />

        <div ref={gridRef} className="flex-1 min-h-0 overflow-y-auto grid grid-cols-[repeat(auto-fit,150px)] auto-rows-[150px] gap-4 justify-center box-border m-4">
          {auth.logged && <Image
            isZoomed
            className="p-12 bg-default-200"
            src={`data:image/svg+xml;utf8,${encodeURIComponent('<svg fill="#606060" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>')}`}
            width={150}
            height={150}
            onClick={uploader.onOpen}
          />}
          
          {
            urls
            .map((item: { path: string, confidence?: number }) => {
              return item.confidence ? item.confidence >= confidence ? item.path : null : item.path
            })
            .filter((url: string | null) => url !== null)
            .map((url, key) => {
              return <Image
                key={key}
                isZoomed
                src={url}
                width={150}
                height={150}
                onClick={() => { if (destroy) remove(url.split("/").pop()!) }}
              />
            })
          }
        </div>
      </div>

      <UploadModal uploader={uploader} />
      <LoginModal auth={auth}/>
    </DefaultLayout>
  )
}