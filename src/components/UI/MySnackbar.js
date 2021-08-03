import Snackbar from '@material-ui/core/Snackbar';
import Alert from './Alert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useState } from 'react';

const MySnackbar = (props) => {
    const [isOpen, setIsopen] = useState(true);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsopen(false);
    };


    return (
        <div>
            {isOpen ? (<Snackbar open={props.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert severity={props.severity}>
                    {props.content}
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Alert>

            </Snackbar>
            ) : null}
        </div>
    )
}

export default MySnackbar;