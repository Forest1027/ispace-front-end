import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import { convertDateToLocal } from '../common/utility';
import { NavLink } from 'react-router-dom';

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
  articleItemIntros: {
    flexGrow: 1,
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
  link: {
    textDecoration: 'none',
    color: theme.palette.text.secondary,
  },
}));

const useConstructor = (callBack = () => { }) => {
  const [hasBeenCalled, setHasBeenCalled] = useState(false);
  if (hasBeenCalled) return;
  callBack();
  setHasBeenCalled(true);
}


const Home = () => {
  const classes = useStyles();
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [articleItems, setArticleItems] = useState([]);
  const [articleCategories, setArticleCategories] = useState([]);

  useConstructor(() => {
    axios.get("http://localhost:8080/articleManagement/v1/articles?page=1&size=10")
      .then(res => {
        setArticleItems(res.data);
      })
      .catch(error => {
        console.log(error)
      });

    axios.get("http://localhost:8080/articleManagement/v1/articleCategories?page=1&size=10")
      .then(res => {
        setArticleCategories(res.data);
      })
      .catch(error => {
        console.log(error)
      });

  });


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
              {/* <InfiniteScroll
                dataLength={items.length} //This is important field to render the next data
                next={fetchData}
                hasMore={true}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
                // below props only if you need pull down functionality
                refreshFunction={this.refresh}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                pullDownToRefreshContent={
                  <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                }
                releaseToRefreshContent={
                  <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                }
              >
                {items}
              </InfiniteScroll> */}
              {articleItems.map(element => {
                return (
                  <div className={classes.itemRoot} key={element.id}>
                    <NavLink className={classes.link} to='/articleDetail'>
                      <div>
                        <Typography variant="h6" component="h2" color="primary">
                          {element.title}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                          {element.description}
                        </Typography>
                        <div>
                          <Grid container className={classes.articleItemIntros}>
                            <Grid item xs={12} sm={2}>
                              <Typography variant="body2" component="p">
                                {element.authorName}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="body2" component="p">
                                {convertDateToLocal(element.updateTime)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                )
              })}
            </Grid>
            <Grid item xs={12} sm={4}>

              <div className={classes.categoryRoot}>
                <div>
                  <Typography variant="button">
                    Discover new topics...
                  </Typography>
                </div>
                <div className={classes.categoryButtons}>
                  {articleCategories.map(element => {
                    return (<Button variant="outlined" key={element.id}>{element.categoryName}</Button>)
                  })}
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div >
  );
};
export default Home;
