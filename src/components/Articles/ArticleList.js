import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { convertDateToLocal, replaceSpaceWithDashInStr } from '../../common/utility';
import { NavLink } from 'react-router-dom';
import useSearchArticles from '../../hooks/useSearchArticles';

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

const ArticleList = (props) => {
    const classes = useStyles();
    const [page, setPage] = useState(1);
    const { loading, error, articles, hasMore } = useSearchArticles(props.query, page, props.url);
    const observer = useRef();
    const lastArticleElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prev) => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    return (
        <div>
            <div>
                {articles.length === 0 ?
                    (<div>No article available.</div>) :
                    articles.map((element, index) => {
                        const content = (
                            <NavLink className={classes.link} to={'/' + replaceSpaceWithDashInStr(element.authorName) + "/" + replaceSpaceWithDashInStr(element.title) + "-" + element.id}>
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
                        );
                        if (articles.length === index + 1) {
                            return (
                                <div className={classes.itemRoot} key={element.id} ref={lastArticleElementRef}>
                                    {content}
                                </div>
                            )
                        } else {
                            return (
                                <div className={classes.itemRoot} key={element.id}>
                                    {content}
                                </div>
                            )
                        }

                    })}
            </div>
            {loading ? <div >Loading...</div> : null}
            {error ? <div>Error occurs, please try again later.</div> : null}
        </div>
    )
}

export default ArticleList;