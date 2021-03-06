import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import DeckIcon from '@material-ui/icons/Deck';
import Box from "@material-ui/core/Box";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useOktaAuth } from '@okta/okta-react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    textDecoration: 'none'
  }
}));

const NavBar = (props) => {
  const classes = useStyles();
  const matches = useMediaQuery('(min-width: 550px)')
  const { authState } = useOktaAuth();
  const history = useHistory();
  const navButtons = (
    <Box className={classes.buttonRoot} display="flex" justifyContent="flex-end">
      {
        Object.keys(props.navItems).map(btnName => {
          const shouldShow = props.navItems[btnName].isAuth ? authState.isAuthenticated : !authState.isAuthenticated;
          return shouldShow ? (
            <Button color="secondary" onClick={props.navItems[btnName].clicked} key={btnName}>{btnName}</Button>) : null
        })
      }
    </Box>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          {
            matches ?
              (<IconButton color="secondary" onClick={() => { history.push('/') }}>
                <DeckIcon />
              </IconButton>) :
              (<IconButton color="secondary" onClick={props.open}>
                <MenuIcon />
              </IconButton>)
          }
          <Typography variant="h6" className={classes.title}>
          </Typography>
          {matches ? navButtons : <DeckIcon position="flex-end" color="secondary" />}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBar;
