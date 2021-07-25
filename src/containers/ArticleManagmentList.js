import React, { useState, useEffect, useRef, useCallback } from 'react';
import ArticleList from "../components/Articles/ArticleList"
import { DataGrid } from '@material-ui/data-grid';
import { useOktaAuth } from '@okta/okta-react';
import { useSearchArticles } from '../hooks/useSearchArticles';
import { convertDateToLocal } from '../common/utility';
import axios from "axios";

const ArticleManagementList = () => {
    const { authState, oktaAuth } = useOktaAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [count, setCount] = useState(0);
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

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
                    res.data.map(ele => {
                        ele.category = ele.articleCategory.categoryName;
                        ele.createTime = convertDateToLocal(ele.createTime);
                        ele.updateTime = convertDateToLocal(ele.updateTime);
                        return ele;
                    })
                    return [...new Set([...res.data])];
                });
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



    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'title', headerName: 'Title', width: 400 },
        {
            field: 'category',
            headerName: 'Category',
            width: 200,
            editable: true,
        },
        {
            field: 'createTime',
            headerName: 'Create time',
            width: 200,
            editable: true,
        },
        {
            field: 'updateTime',
            headerName: 'Update time',
            width: 200,
            editable: true,
        },
    ];

    return (
        <div>
            <div>
                <h1>Manage My Articles</h1>
            </div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={articles}
                    columns={columns}
                    pageSize={size}
                    checkboxSelection
                    rowCount={count}
                    page={page - 1}
                    pagination
                    paginationMode="server"
                    onPageChange={(params) => {
                        setPage(params.page + 1);
                    }}
                    loading={loading}
                />
            </div>
        </div>
    )
}

export default ArticleManagementList;