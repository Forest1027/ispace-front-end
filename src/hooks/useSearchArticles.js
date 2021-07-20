import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useSearchArticles = (query, page) => {
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(false);
     const [articles, setArticles] = useState([]);
     const [hasMore, setHasMore] = useState(false);

     useEffect(() => {
          setArticles([]);
     }, [query]);

     useEffect(() => {
          setLoading(true);
          setError(false);
          axios.get(`http://localhost:8080/articleManagement/v1/articles?page=${page}&size=2`)
               .then(res => {
                    setArticles(prev => {
                         return [...new Set([...prev, ...res.data])];
                    });
                    setHasMore(res.data.length > 0);
                    setLoading(false);
               }).catch(error => {
                    setLoading(false);
                    setError(error);
               });
     }, [query, page]);

     return {loading, error, articles, hasMore};
}

export default useSearchArticles;