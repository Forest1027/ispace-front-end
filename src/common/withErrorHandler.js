import React, { useEffect, useState } from "react";
import MySnackbar from "../components/UI/MySnackbar";

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        console.log("in error handler")
        const [error, setError] = useState(null);

        const errorConfirmedHandler = () => {
            setError(null);
        }

        const reqInterceptor = axios.interceptors.request.use(req => {
            setError(null);
            return req
        });

        const resInterceptor = axios.interceptors.response.use(res => res, error => {
            setError(error);
            console.log(error)
        });

        useEffect(() => {
            axios.interceptors.request.eject(reqInterceptor);
            axios.interceptors.response.eject(resInterceptor);
        }, [reqInterceptor, resInterceptor]);

        return (
            <div>
                <MySnackbar
                    open={error !== null}
                    onClose={errorConfirmedHandler}
                    severity="error"
                    content={error ? error.message : null}
                />
                <WrappedComponent {...props} />
            </div>
        );
    }
};

export default withErrorHandler;

