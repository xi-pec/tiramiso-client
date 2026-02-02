import { useState, useEffect } from "react"
import { useDisclosure } from "@heroui/modal"
import { addToast } from "@heroui/toast"

const API_URL = import.meta.env.VITE_API_URL || "/api"
console.log(import.meta.env.VITE_API_URL)

export function useAuth() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [logged, setLogged] = useState<boolean>(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  async function login(username: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include"
    })

    const json = await response.json()

    switch(json.code) {
      case 0:
        setLogged(true)
        addToast({
          title: "Successfully logged in!",
          variant: "solid",
          color: "success"
        })
      break

      case 1:
        addToast({
          title: "Already logged in!",
          variant: "solid",
          color: "danger"
        })
      break

      case 2:
        addToast({
          title: "Invalid credentails!",
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

    return !json.code
  }

  async function logout() {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include"
    })

    const json = await response.json()

    switch(json.code) {
      case 0:
        setLogged(false)
        addToast({
          title: "Successfully logged out!",
          variant: "solid",
          color: "success"
        })
      break

      case 1:
        setLogged(false)
        addToast({
          title: "Not logged in!",
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

    return !json.code
  }

  async function validate() {
    const response = await fetch(`${API_URL}/validate`, { credentials: "include" })
    const json = await response.json()

    setLogged(json.code === 0)
    
    return !json.code
  }

  function handleClose() {
    setUsername("")
    setPassword("")
  }

  function handleLogin(cb: () => any) {
    return login(username, password)
      .then((success) => {
        if (success) cb()
        return success
      })
  }

  useEffect(() => {
    validate()
  }, [])

  return { isOpen, onOpen, onOpenChange, logged, login, logout, validate, handleClose, handleLogin, username, password, setUsername, setPassword }
}