import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";

const Progress = (props) => {
    return (
        <Fade
            in={props.loading}
            unmountOnExit
        >
            <CircularProgress color="secondary"/>
        </Fade>
    );
};

export default Progress;