import { useState, useEffect } from "react";
import axios from "axios";

const useSearchArticles = (query, page, url) => {
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
          axios.get(`${url}?page=${page}&size=10&search=${query}`)
               .then(res => {
                    if (res.status === 200) {
                         setArticles(prev => {
                              return [...new Set([...prev, ...res.data])];
                         });
                         setHasMore(res.data.length > 0);
                    } else {
                         setError(res.data);
                    }
                    setLoading(false);
               }).catch(error => {
                    setLoading(false);
                    setError(error);
               });
     }, [query, page, url]);

     return { loading, error, articles, hasMore };
}

export default useSearchArticles;