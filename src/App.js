import React, { useState } from 'react';
import { Route, useHistory, Switch } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, LoginCallback } from '@okta/okta-react';
import oktaConfig from './config/okta-config';
import Home from './containers/Home';
import Login from './containers/Login';
import Navbar from './components/UI/NavBar';
import Container from '@material-ui/core/Container';
import * as layoutConstants from "./common/Constants";
import Signup from './containers/Signup';
import { makeStyles } from '@material-ui/core/styles';

import './App.css';
import ArticleDetail from './containers/ArticleDetail';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      marginTop: '5em',
    },
  },
}));

const oktaAuth = new OktaAuth(oktaConfig.oidc);

const App = () => {
  const classes = useStyles();
  const history = useHistory(); // example from react-router

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri, window.location.origin));
  };

  const login = () => {
    // Redirect to the /login page that has a CustomLoginComponent
    history.push('/login');
  };

  const onAuthResume = async () => {
    history.push('/login');
  };


  const logout = async () => {
    try {
      await oktaAuth.signOut();
    } catch (err) {
      throw err;
    }
  };

  const signup = async () => {
    history.push("/signup");
  }

  const [navItems] = useState({
    "Login": {
      "isAuth": false,
      "clicked": login,
      "icon": layoutConstants.LOGIN_ICON
    },
    "Signup": {
      "isAuth": false,
      "clicked": signup,
      "icon": layoutConstants.SIGNUP_ICON
    },
    "Logout": {
      "isAuth": true,
      "clicked": logout,
      "icon": layoutConstants.LOGOUT_ICON
    }
  });

  return (
    <Security
      oktaAuth={oktaAuth}
      onAuthRequired={login}
      restoreOriginalUri={restoreOriginalUri}
    >
      <Navbar navItems={{ ...navItems }} />
      <Container className={classes.root}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login/callback" render={(props) => <LoginCallback {...props} onAuthResume={onAuthResume} />} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/:user/:articleId" exact component={ArticleDetail} />
        </Switch>
      </Container>
    </Security>
  );
};

export default App;

