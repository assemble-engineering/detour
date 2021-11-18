import { useEffect, useState } from "react";
import netlifyAuth from '../netlifyAuth.js';
import Button from "../components/Button";
import netlifyIdentity from "netlify-identity-widget";

type Props ={
  loggedIn: any 
  setLoggedIn: any
}

const NetlifyIdentity = ({loggedIn, setLoggedIn}: Props) => {
const [user, setUser] = useState(null)
netlifyIdentity.on('logout', () => {
  location.reload()
});
  
  useEffect(() => {
    netlifyAuth.initialize((user) => {
      setLoggedIn(!!user)
      setUser(user)
    })
  }, [loggedIn])
  
  const login = () => {
    netlifyAuth.authenticate((user) => {
      setLoggedIn(!!user)
      setUser(user)
      netlifyAuth.closeModal()
    })
  }
  
  const logout = () => {
    netlifyAuth.signout(() => {
      setLoggedIn(false)
      setUser(null)
    })
  }
  const openModal = () => {
    netlifyIdentity.open();
  }
  const renderLogoutMenu = () => {
    return (
      <button onClick={openModal}>
        {netlifyIdentity.currentUser().email}
      </button>
    )
  }

  return loggedIn ? (
    <div className="pb-2 self-end">
      {renderLogoutMenu()}
    </div>
  ): (
    <Button onClick={login}>
      Login
    </Button>
  )
}
export default NetlifyIdentity;
