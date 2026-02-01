import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"

import { useState } from "react"

export function LoginModal({ auth }: any) {
  const [loading, setLoading] = useState(false)

  function handleLogin(handler: () => void) {
    setLoading(true)

    auth.handleLogin(handler).then(() => {
      setLoading(false)
    })
  }

  return (
    <Modal isOpen={auth.isOpen} placement="center" onOpenChange={auth.onOpenChange} onClose={auth.handleClose}>
      <ModalContent>
        {(onClose) => <>
          <ModalHeader>Login</ModalHeader>
          <ModalBody>
            <Input
              color="primary"
              label="Username"
              placeholder="Enter your username"
              variant="underlined"
              value={auth.username}
              onValueChange={auth.setUsername}
            />
            <Input
              color="primary"
              label="Password"
              placeholder="Enter your password"
              type="password"
              variant="underlined"
              value={auth.password}
              onValueChange={auth.setPassword}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button isLoading={loading} color="primary" onPress={() => handleLogin(onClose)}>
              {!loading && "Sign in"}
            </Button>
          </ModalFooter>
        </>}
      </ModalContent>
    </Modal>
  )
}