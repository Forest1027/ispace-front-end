import Snackbar from '@material-ui/core/Snackbar';
import Alert from './Alert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const MySnackbar = (props) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        props.setOpen(false);
    };


    return (
        <div>
            <Snackbar open={props.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert severity={props.severity}>
                    {props.content}
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Alert>

            </Snackbar>
        </div>
    )
}

export default MySnackbar;