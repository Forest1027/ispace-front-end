import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import { useOktaAuth } from '@okta/okta-react';
import { convertDateToLocal } from '../common/utility';
import axios from "axios";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import * as constants from '../common/Constants'
import MySnackbar from '../components/UI/MySnackbar';
import MyDialog from '../components/UI/MyDialog';

const useStyles = makeStyles((theme) => ({
    categoryRoot: {
        marginTop: "30px",
        marginBottom: "20px",
    },
    categoryButtons: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

const ArticleManagementList = () => {
    const classes = useStyles();
    const { authState, oktaAuth } = useOktaAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [count, setCount] = useState(0);
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const [toDelete, setToDelete] = useState(false);
    const [deleteArticleTitle, setDeleteArticleTitle] = useState("");
    const [deleteArticleId, setDeleteArticleId] = useState(0);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const url = "http://localhost:8080/articleManagement/v1/articles"

    const fetchArticleCount = useCallback((email) => {
        setLoading(true);
        const accessToken = `Bearer ${oktaAuth.getAccessToken()}`;
        axios.get(`http://localhost:8080/articleManagement/v1/articles/count/${email}`, { headers: { 'Authorization': accessToken } })
            .then(res => {
                console.log("result: " + res.data)
                setCount(res.data);
            })
            .catch(error => {
                console.log(error)
            });
    }, [oktaAuth]);

    const fetchArticles = useCallback(() => {
        setLoading(true);
        axios.get(`${url}?page=${page}&size=${size}&search=${query}`)
            .then(res => {
                setArticles(prev => {
                    res.data.map((ele, index) => {
                        ele.category = ele.articleCategory.categoryName;
                        ele.createTime = convertDateToLocal(ele.createTime);
                        ele.updateTime = convertDateToLocal(ele.updateTime);
                        ele.columnId = (page - 1) * size + index + 1;
                        return ele;
                    })
                    return [...new Set([...res.data])];
                });
                setLoading(false);
            }).catch(error => {
                setError(error);
            });
    }, [page, query, size]);


    useEffect(() => {
        if (!authState.isAuthenticated) {
            // When user isn't authenticated, forget any user info
            setUserInfo(null);
        } else {
            oktaAuth.getUser().then((info) => {
                setUserInfo(info);
                setQuery(`authorEmail==${info.email}`)
                fetchArticleCount(info.email);
                fetchArticles();
                setLoading(false);
            });
        }
    }, [authState, oktaAuth, fetchArticles, fetchArticleCount, count]);

    const onEditHandler = (articleId) => {
        history.push({
            pathname: '/articleDetail',
            state: {
                mode: constants.MODE_EDIT,
                articleId: articleId,
                author: userInfo.email
            }
        });
    }

    const onCreateHandler = () => {
        history.push({
            pathname: '/articleDetail',
            state: {
                mode: constants.MODE_CREATE
            }
        });
    }

    const handleDeleteClose = () => {
        setToDelete(false);
    }

    const handleDeleteOpen = (article) => {
        setDeleteArticleTitle(article.title);
        setDeleteArticleId(article.id);
        setToDelete(true);
    }

    const onDeleteHandler = (articleId) => {
        const accessToken = `Bearer ${oktaAuth.getAccessToken()}`;
        axios.delete(`http://localhost:8080/articleManagement/v1/articles/${articleId}`, { headers: { 'Authorization': accessToken } })
            .then(res => {
                setToDelete(false);
                setDeleteSuccess(true);
                fetchArticles();
            })
            .catch(error => {
                console.log(error)
            });

    }

    const onBulkDeleteHandler = (articleIds) => {

    }

    const renderButtons = (params) => {
        return (
            <div>
                <Button color="secondary" onClick={() => onEditHandler(params.row.id)}>Edit</Button>
                <Button color="primary" onClick={() => handleDeleteOpen(params.row)}>Delete</Button>
            </div>
        );
    }

    const renderArticleLinks = (params) => {
        return (
            <div>
                <div onClick={() => onEditHandler(params.row.id)}>{params.row.title}</div>
            </div>
        )
    }



    const columns = [
        { field: 'columnId', headerName: 'ID', width: 90, },
        { field: 'title', headerName: 'Title', width: 300, renderCell: renderArticleLinks, },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
            editable: false,
        },
        {
            field: 'createTime',
            headerName: 'Create time',
            width: 200,
            editable: false,
        },
        {
            field: 'updateTime',
            headerName: 'Update time',
            width: 200,
            editable: false,
        },
        {
            field: 'action',
            headerName: 'Actions',
            width: 200,
            renderCell: renderButtons,
        }
    ];

    return (
        <div>
            <div>
                <h1>Manage My Articles</h1>
            </div>
            <div className={classes.categoryRoot}>
                <div className={classes.categoryButtons}>
                    <Button variant="outlined" color="secondary" onClick={onCreateHandler}>Create</Button>
                    {/* <Button variant="outlined" color="primary">Delete</Button> */}
                </div>
            </div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={articles}
                    columns={columns}
                    pageSize={size}
                    // checkboxSelection
                    rowCount={count}
                    page={page - 1}
                    pagination
                    paginationMode="server"
                    onPageChange={(params) => {
                        setPage(params.page + 1);
                    }}
                    loading={loading}
                    headerAlign='center'
                />
            </div>
            <MyDialog open={toDelete} handleClose={handleDeleteClose} dialogTitle={"Delete the article"}
                dialogContent={`Are you sure to delete article "${deleteArticleTitle}"`} handleConfirm={() => onDeleteHandler(deleteArticleId)} />
            <MySnackbar open={deleteSuccess} severity={"success"} content={"The content has been successfully deleted."} />
        </div>
    )
}

export default ArticleManagementList;