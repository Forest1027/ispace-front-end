import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';


const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  }, [authState, oktaAuth]); // Update if authState changes

  const login = async () => {
    oktaAuth.signInWithRedirect();
  };

  const logout = async () => {
    try {
      await oktaAuth.signOut();
    } catch (err) {
    
        throw err;
      
    }
  };

  if (authState.isPending) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div>
      <div>
        <h1>Login Page</h1>

        { authState.isAuthenticated && !userInfo
        && <div>Loading user information...</div>}

        {authState.isAuthenticated && userInfo
        && (
        <div>
          <p>
            Welcome, &nbsp;
            {userInfo.name}
            !
          </p>
          <p>
            You have successfully authenticated against your Okta org, and have been redirected back to this application.  You now have an ID token and access token in local storage.
          </p>
          <Button id="logout-button" variant="outlined" color="secondary" onClick={logout}>Logout</Button>
        </div>
        )}

        {!authState.isAuthenticated
        && (
        <div>
          <p>If you&lsquo;re viewing this page then you have successfully started this React application.</p>
          <p>
            When you click the login button below, you will be redirected to the login page on your Okta org.
            After you authenticate, you will be returned to this application with an ID token and access token.  These tokens will be stored in local storage and can be retrieved at a later time.
          </p>
          <Button id="login-button" variant="outlined" color="secondary" onClick={login}>Login</Button>
        </div>
        )}

      </div>
    </div>
  );
};
export default Home;
