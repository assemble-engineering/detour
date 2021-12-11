import React from 'react';
import { useAuth } from '../hooks/useAuth';

const PleaseSignIn = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return null;
  } else return <>{children}</>;
};

export default PleaseSignIn;
