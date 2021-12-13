import { useEffect } from "react";
import netlifyAuth from "../netlifyAuth";
import Button from "../components/Button";
import netlifyIdentity from "netlify-identity-widget";

type Props = {
  loggedIn: any;
  setLoggedIn: any;
};

const NetlifyIdentity = ({ loggedIn, setLoggedIn }: Props) => {
  netlifyIdentity.on("logout", () => {
    window.location.reload();
  });
  netlifyIdentity.on('login', user => {
    setLoggedIn(!!user);
    netlifyIdentity.close();
  });

  useEffect(() => {
    netlifyAuth.initialize((user) => {
      setLoggedIn(!!user);
    });
  }, [loggedIn, setLoggedIn]);

  const login = () => {
    netlifyAuth.authenticate((user) => {
      setLoggedIn(!!user);
    });
  };

  // const logout = () => {
  //   netlifyAuth.signout(() => {
  //     setLoggedIn(false);
  //   });
  // };

  const openModal = () => {
    netlifyIdentity.open();
  };

  return loggedIn ? (
    <div className="pb-2 self-end">
      <button onClick={openModal}>
        {netlifyIdentity.currentUser()?.email}
      </button>
    </div>
  ) : (
    <Button onClick={login}>Login</Button>
  );
};

export default NetlifyIdentity;
