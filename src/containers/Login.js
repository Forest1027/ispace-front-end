import React, { useEffect, useRef, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import * as OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import config from '../config/okta-config';
import { checkValidity, updateObject } from "../common/utility";
import CredentialForm from "../components/Auth/CredentialForm";

const Login = ({ setCorsErrorModalOpen }) => {
  const { oktaAuth } = useOktaAuth();
  const [sessionToken, setSessionToken] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');



  // const handleUsernameChange = (e) => {
  //   setUsername(e.target.value);
  // };

  // const handlePasswordChange = (e) => {
  //   setPassword(e.target.value);
  // };



  const [credentialItems, setCredentialItems] = useState({
    email: {
      value: '',
      type: 'email',
      name: 'email',
      display: 'Email',
      placeholder: 'Your Email',
      touched: false,
      valid: false,
      helpText: '',
      validation: {
        required: true,
        isEmail: true,
      }
    },
    password: {
      value: '',
      type: 'password',
      name: 'password',
      display: 'Password',
      placeholder: 'Your Password',
      touched: false,
      valid: false,
      helpText: '',
      validation: {
        required: true,
      }
    },
  })

  const [formIsValid, setFormIsValid] = useState(false);

  const onInputChangeHandler = (event) => {
    const name = event.target.name;
    const inputVal = event.target.value;
    const errorArr = checkValidity(inputVal, credentialItems[name].validation, credentialItems['password'].value)
    const helpText = errorArr.join(',');
    if (name === 'email') {
      setUsername(inputVal);
    }
    if (name === 'password') {
      setPassword(inputVal);
    }
    const updatedObj = updateObject(credentialItems, {
      [name]: updateObject(credentialItems[name], {
        value: inputVal,
        touched: true,
        valid: errorArr.length === 0,
        helpText: helpText
      })
    });
    let formValid = false;
    for (let key in updatedObj) {
      formValid = updatedObj[key].valid
    }
    setCredentialItems(updatedObj);
    setFormIsValid(formValid);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    oktaAuth.signInWithCredentials({ username, password })
      .then(res => {
        const sessionToken = res.sessionToken;
        setSessionToken(sessionToken);
        // sessionToken is a one-use token, so make sure this is only called once
        oktaAuth.signInWithRedirect({ sessionToken });
      })
      .catch(err => console.log('Found an error', err));
  };

  let form = (<CredentialForm changed={onInputChangeHandler} submitted={onSubmitHandler}
    formData={credentialItems} formValid={formIsValid} />);

  if (sessionToken) {
    // Hide form while sessionToken is converted into id/access tokens
    return null;
  }

  return (
    <div>
      {form}
    </div>

  );

  // return (
  // <form onSubmit={handleSubmit}>
  //   <label>
  //     Username:
  //     <input
  //       id="username" type="text"
  //       value={username}
  //       onChange={handleUsernameChange} />
  //   </label>
  //   <label>
  //     Password:
  //     <input
  //       id="password" type="password"
  //       value={password}
  //       onChange={handlePasswordChange} />
  //   </label>
  //   <input id="submit" type="submit" value="Submit" />
  // </form>
  // );
};

export default Login;
