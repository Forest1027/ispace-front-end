const CLIENT_ID = '0oaxe5e4fdzOE4qzn5d6';
const ISSUER = 'https://dev-83250362.okta.com/oauth2/default';
const OKTA_TESTING_DISABLEHTTPSCHECK = process.env.OKTA_TESTING_DISABLEHTTPSCHECK || false;
const REDIRECT_URI = `${window.location.origin}/login/callback`;
let USE_INTERACTION_CODE = false;
if (process.env.USE_INTERACTION_CODE === 'true') {
  USE_INTERACTION_CODE = true;
}

const oktaConfig =  {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
    useInteractionCode: USE_INTERACTION_CODE,
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8000/api/messages',
  },
};

export default oktaConfig;