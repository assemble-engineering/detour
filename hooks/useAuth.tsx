import React, { useContext, useEffect, useReducer } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

type NetlifyUser = netlifyIdentity.User | null;

type State = {
  isLoggedIn: boolean;
  user: NetlifyUser;
};

type Action = { type: 'init'; user: NetlifyUser } | { type: 'login'; user: NetlifyUser } | { type: 'logout' };

const AuthContext = React.createContext<
  { user: NetlifyUser; isLoggedIn: boolean; login: () => void; logout: () => void } | undefined
>(undefined);

const authReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'init': {
      if (action.user) {
        return {
          isLoggedIn: true,
          user: action.user,
        };
      } else {
        return {
          isLoggedIn: false,
          user: null,
        };
      }
    }
    case 'login': {
      return {
        isLoggedIn: true,
        user: action.user,
      };
    }
    case 'logout': {
      return {
        isLoggedIn: false,
        user: null,
      };
    }
    default: {
      return state;
    }
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, { isLoggedIn: false, user: null });

  useEffect(() => {
    netlifyIdentity.on('init', user => dispatch({ type: 'init', user }));
    netlifyIdentity.on('login', user => {
      dispatch({ type: 'login', user });
      netlifyIdentity.close();
    });
    netlifyIdentity.on('logout', () => dispatch({ type: 'logout' }));
    netlifyIdentity.init();

    return () => {
      netlifyIdentity.off('init');
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  const login = () => {
    netlifyIdentity.open('login');
  };

  const logout = () => {
    netlifyIdentity.logout();
  };

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used withing a AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
