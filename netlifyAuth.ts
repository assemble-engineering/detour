import netlifyIdentity from 'netlify-identity-widget';

declare global {
  interface Window {
    netlifyIdentity: any;
  }
}

export type NetlifyUser = netlifyIdentity.User | null;

const netlifyAuth: {
  user: NetlifyUser;
  isAuthenticated: boolean;
  initialize: (callback: (user: NetlifyUser) => void) => void;
  authenticate: (callback: (user: NetlifyUser) => void) => void;
  signout: (callback: (user: NetlifyUser) => void) => void;
} = {
  isAuthenticated: false,
  user: null,
  initialize(callback) {
    window.netlifyIdentity = netlifyIdentity;
    netlifyIdentity.on('init', user => {
      callback(user);
    });
    netlifyIdentity.init();
  },
  authenticate(callback: (user: NetlifyUser) => void) {
    this.isAuthenticated = true;
    netlifyIdentity.open();
    netlifyIdentity.on('login', user => {
      this.user = user;
      netlifyIdentity.close();
      callback(user);
    });
  },
  signout(callback) {
    netlifyIdentity.logout();
  },
};

export default netlifyAuth;
