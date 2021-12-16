import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import Logo from './Logo';

const NavBar = () => {
  const { user, logout, isLoggedIn, login } = useAuth();
  return (
    <div className="py-3 shadow-md mb-12">
      <div className="max-w-screen-xl w-11/12 mx-auto flex items-center justify-between ">
        <Logo />
        {isLoggedIn ? (
          <div>
            {user?.email} (
            <button className="underline cursor-pointer" onClick={logout}>
              Logout
            </button>
            )
          </div>
        ) : (
          <Button size="small" onClick={login}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
