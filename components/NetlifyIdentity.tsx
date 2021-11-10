import { useEffect, useState } from "react";
import netlifyAuth from '../netlifyAuth.js';
import Button from "../components/Button";

type Props ={
  loggedIn: any 
  setLoggedIn: any
}

const NetlifyIdentity = ({loggedIn, setLoggedIn}: Props) => {
  let [user, setUser] = useState(null)
  
  useEffect(() => {
    netlifyAuth.initialize((user) => {
      setLoggedIn(!!user)
      setUser(user)
    })
  }, [loggedIn])
  
  let login = () => {
    netlifyAuth.authenticate((user) => {
      setLoggedIn(!!user)
      setUser(user)
      netlifyAuth.closeModal()
    })
  }
  
  let logout = () => {
    netlifyAuth.signout(() => {
      setLoggedIn(false)
      setUser(null)
    })
  }

  return loggedIn ? (
    <div className="pb-2 self-end">
      <Button onClick={logout} color="light-gray" size="small">
        Logout
      </Button>
    </div>
  ): (
    <Button onClick={login}>
      Login
    </Button>
  )
}
export default NetlifyIdentity;