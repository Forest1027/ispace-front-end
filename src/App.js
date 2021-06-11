import React, {useState} from 'react';
import { Route, useHistory, Switch } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, LoginCallback } from '@okta/okta-react';
import oktaConfig from './config/okta-config';
import Home from './containers/Home';
import CustomLoginComponent from './containers/Login';
import Navbar from './components/UI/NavBar';
import Container from '@material-ui/core/Container';
import * as layoutConstants from "./constants/LayoutConstants";

import './App.css';

const oktaAuth = new OktaAuth(oktaConfig.oidc);

const App = () => {
  const history = useHistory(); // example from react-router

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri, window.location.origin));
  };

  const customAuthHandler = () => {
    // Redirect to the /login page that has a CustomLoginComponent
    history.push('/login');
  };

  const onAuthResume = async () => {
    history.push('/login');
  };

  const [corsErrorModalOpen, setCorsErrorModalOpen] = useState(false);
  const [navItems, setNavItems] = useState({
    "Login" : {
        "isAuth":false,
        "url":layoutConstants.LOGIN_URL,
        "icon":layoutConstants.LOGIN_ICON
    },
    // "Signup" : {
    //     "isAuth":false,
    //     "url":layoutConstants.SIGNUP_URL,
    //     "icon":layoutConstants.SIGNUP_ICON
    // },
    "Logout": {
        "isAuth":true,
        "url":layoutConstants.LOGOUT_URL,
        "icon":layoutConstants.LOGOUT_ICON
    }
});

  return (
    <Security
      oktaAuth={oktaAuth}
      onAuthRequired={customAuthHandler}
      restoreOriginalUri={restoreOriginalUri}
    >
      <Navbar navItems={{...navItems}}/>
      <Container text style={{ marginTop: '7em' }}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login/callback" render={(props) => <LoginCallback {...props} onAuthResume={onAuthResume} />} />
          <Route path="/login" render={() => <CustomLoginComponent {...{ setCorsErrorModalOpen }} />} />
        </Switch>
      </Container>
    </Security>
  );
};

export default App;

