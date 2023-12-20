import { useEffect } from 'react'
import { signOut } from "next-auth/react"

const Logout = () => {

  useEffect(() => {
    signOut()
  }, [])

  return null
}

export default Logout;
