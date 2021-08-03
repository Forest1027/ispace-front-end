import { useParams } from "react-router-dom";
import useConstructor from "../hooks/useConstructor";
import axios from "axios";
import Box from "@material-ui/core/Box";
import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { convertDateToLocal } from '../common/utility';
import DOMPurify from "dompurify";

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: '80px'
    },
    margin: {
        margin: theme.spacing(1),
    },
    link: {
        textDecoration: 'none'
    },
    description: {
        fontSize: 20,
        fontWeight: 10
    },
    content: {
        fontSize: 20
    },
}));

const getArticleQueryId = (id) => {
    var strArr = id.split("-");
    return strArr[strArr.length - 1];
}

const ArticleView = (props) => {
    const classes = useStyles();
    const { articleId } = useParams();
    const id = getArticleQueryId(articleId);
    const [article, setArticle] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useConstructor(() => {
        setLoading(true);
        setError(false);
        axios.get(`http://localhost:8080/articleManagement/v1/articles/${id}`)
            .then(res => {
                setArticle(res.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
            });
    });

    return (
        <Box justifyContent="center" display="flex" flexWrap='wrap' className={classes.root}>
            <Box width='60%'>
                <Box>
                    <div>
                        <h1>{article.title}</h1>
                        <div>
                            <Grid container className={classes.articleItemIntros}>
                                <Grid item xs={12} sm={2}>
                                    {article.authorName}
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    {convertDateToLocal(article.updateTime)}
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Box>
                <Box className={classes.description}>
                    <div><p><i>{article.description}</i></p></div>
                </Box>
                <Box className={classes.content} justifyContent="flex-start">
                    <div dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(article.content)}}/>
                </Box>
            </Box>
            {loading ? <div >Loading...</div> : null}
            {error ? <div>Error occurs, please try again later.</div> : null}
        </Box>

    );
};

export default ArticleView;