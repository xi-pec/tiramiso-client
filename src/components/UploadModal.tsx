import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Image } from "@heroui/image"

export function UploadModal({ uploader }: any) {
  return (
    <Modal isOpen={uploader.isOpen} placement="center" onOpenChange={uploader.onOpenChange} onClose={uploader.handleClose}>
      <ModalContent>
        {(onClose) => <>
          <ModalHeader>Upload Item</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2 w-full aspect-square">
              <label className="relative block w-full h-full rounded-md cursor-pointer overflow-hidden">
                {uploader.preview ? (
                  <Image
                    src={uploader.preview}
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
                  accept=".png,.jpg,.jpeg"
                  name="item"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={uploader.handleChange}
                />
              </label>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button isDisabled={!uploader.allowed} color="primary" onPress={() => { uploader.handleUpload(onClose) } }>Upload</Button>
          </ModalFooter>
        </>}
      </ModalContent>
    </Modal>
  )
}