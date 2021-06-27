import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  sectionRoot: {
    flexGrow: 1,
  },
  itemRoot: {
    marginTop: "30px",
    marginBottom: "30px",
  },
  categoryRoot: {
    marginTop: "30px",
    marginBottom: "30px",
  },
  categoryButtons: {
    '& > *': {
      margin: theme.spacing(1),
      color: 'grey',
    },
  },
  divider: {
    marginTop: "50px",
    marginBottom: "20px"
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const Home = () => {
  const classes = useStyles();
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
        <h1>Join iSpace to share your mind</h1>

        {authState.isAuthenticated && !userInfo
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
              <p>iSpace is a place for you to write, read and connect. Start your writing journey with iSpace today!</p>
            </div>
          )}

      </div>
      <Divider className={classes.divider} />
      <div>
        <div className={classes.sectionRoot}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <div className={classes.itemRoot}>
                <div>
                  <Typography variant="h6" component="h2">
                    Why I’m Leaving Mumford & Sons
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    Winston Marshall
                  </Typography>
                  <Typography variant="body2" component="p">
                    well meaning and kindly.
                  </Typography>
                </div>
              </div>
              <div className={classes.itemRoot}>
                <div>
                  <Typography variant="h6" component="h2">
                    Why I’m Leaving Mumford & Sons
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    Winston Marshall
                  </Typography>
                  <Typography variant="body2" component="p">
                    well meaning and kindly.
                  </Typography>
                </div>
              </div>
              <div className={classes.itemRoot}>
                <div>
                  <Typography variant="h6" component="h2">
                    Why I’m Leaving Mumford & Sons
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    Winston Marshall
                  </Typography>
                  <Typography variant="body2" component="p">
                    well meaning and kindly.
                  </Typography>
                </div>
              </div>
              <div className={classes.itemRoot}>
                <div>
                  <Typography variant="h6" component="h2">
                    Why I’m Leaving Mumford & Sons
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    Winston Marshall
                  </Typography>
                  <Typography variant="body2" component="p">
                    well meaning and kindly.
                  </Typography>
                </div>
              </div>
              <div className={classes.itemRoot}>
                <div>
                  <Typography variant="h6" component="h2">
                    Why I’m Leaving Mumford & Sons
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    Winston Marshall
                  </Typography>
                  <Typography variant="body2" component="p">
                    well meaning and kindly.
                  </Typography>
                </div>
              </div>
              <div className={classes.itemRoot}>
                <div>
                  <Typography variant="h6" component="h2">
                    Why I’m Leaving Mumford & Sons
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    Winston Marshall
                  </Typography>
                  <Typography variant="body2" component="p">
                    well meaning and kindly.
                  </Typography>
                </div>
              </div>
              <div className={classes.itemRoot}>
                <div>
                  <Typography variant="h6" component="h2">
                    Why I’m Leaving Mumford & Sons
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    Winston Marshall
                  </Typography>
                  <Typography variant="body2" component="p">
                    well meaning and kindly.
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div className={classes.categoryRoot}>
                <div>
                  <Typography variant="button">
                    Discover new topics...
                  </Typography>
                </div>
                <div className={classes.categoryButtons}>
                  <Button variant="outlined">Self</Button>
                  <Button variant="outlined">Relationship</Button>
                  <Button variant="outlined">Career</Button>
                  <Button variant="outlined">Travel</Button>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};
export default Home;
