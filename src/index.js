import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';

const outerTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#212121',
    },
    secondary: {
      main: '#2196f3',
    },
  },
});


ReactDOM.render(
  <Router>
    <ThemeProvider theme={outerTheme}>
      <App />
    </ThemeProvider>
  </Router>,
  document.getElementById('root')
);
