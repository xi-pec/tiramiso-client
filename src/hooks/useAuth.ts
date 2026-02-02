import { useState, useEffect } from "react"
import { useDisclosure } from "@heroui/modal"

const API_URL = import.meta.env.VITE_API_URL || ""

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
      break

      case 1:
        console.log("already logged in")
        setLogged(true)
      break

      default:
        console.log("??")
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
      break

      case 1:
        console.log("not logged in")
        setLogged(false)
      break

      default:
        console.log("??")
    }

    return !json.code
  }

  async function validate() {
    const response = await fetch(`${API_URL}/validate`, { credentials: "include" })
    const json = await response.json()

    if (json.code === 0) {
      setLogged(true)
    } else {
      setLogged(false)
    }

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