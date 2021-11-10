import { useEffect, useState } from "react";
import netlifyAuth from '../netlifyAuth.js';

const NetlifyIdentity = () => {
  let [loggedIn, setLoggedIn] = useState(netlifyAuth.isAuthenticated)
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
    <div>
      you are logged in
      <button onClick={logout}>
      Logout
    </button>
    </div>
  ): (
    <button onClick={login}>
      Log in here.
    </button>
  )
}
export default NetlifyIdentity;