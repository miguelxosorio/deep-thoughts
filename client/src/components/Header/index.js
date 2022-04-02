import React from 'react';
// LINK
import { Link } from 'react-router-dom';

// AuthService
import Auth from '../../utils/auth';

const Header = () => {

  const logout = event => {
    event.preventDefault();
    //  the .logout() method, which will remove the token from localStorage and then refresh the application by taking the user back to the homepage
    Auth.logout();
  }

  return (
    <header className="bg-secondary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link>
          <h1>Deep Thoughts</h1>
        </Link>

        {/* Whenever a page renders the <Header> component, which should be on every single page because it's rendered by the <App> component, we check to see if the user is logged in and return navigation items depending on the result.  */}
        <nav className='text-center'>
        {Auth.loggedIn() ? (
          <>
            <Link to={'/profile'}>Me</Link>
            <a href='/' onClick={logout}>
              Logout
            </a>
          </>
        ) : (
          <>
            <Link to={'/login'}>Login</Link>
            <Link to={'/signup'}>Signup</Link>
          </>
        )}
        {/* inspect in browser and Link turns to <a> */}
          {/* <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
