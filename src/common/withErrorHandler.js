import React, { useEffect, useState } from "react";
import MySnackbar from "../components/UI/MySnackbar";

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        const [error, setError] = useState(null);
        const [open, setOpen] = useState(false);

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
                    open={open}
                    setOpen={setOpen}
                    severity="error"
                    content={error ? error.message : null}
                />
                <WrappedComponent {...props} />
            </div>
        );
    }
};

export default withErrorHandler;

