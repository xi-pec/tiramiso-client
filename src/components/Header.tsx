import { Button } from "@heroui/button"

import { useState } from "react"

export function Header({ auth }: any) {
  const [loading, setLoading] = useState(false)

  function login() {
    auth.onOpen()
  }

  function logout() {
    setLoading(true)

    auth.logout()
      .then(() => setLoading(false))
  }

  return <div className="w-full grid place-items-end">
    <Button
      isLoading={loading}
      color="primary"
      variant="light"
      onPress={auth.logged ? logout : login}
    >{auth.logged ? loading ? "" : "Logout" : "Login"}</Button>
  </div>
}