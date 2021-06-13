import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import { Autorenew } from '@material-ui/icons';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '500px',
        backgroundColor: theme.palette.background.paper,
    },
    header: {
        textAlign: 'center',
        height: '40px',
        paddingTop: '5%',
        paddingBottom: '5%'
    },
    body: {
        textAlign: 'center',
        paddingTop: '2%',
        paddingBottom: '2%'
    },
    submitButton: {
        backgroundColor: "#42a5f5",
        color: 'white',
        height: '100%',
        textAlign: 'left',
        margin: '25px',
        width: '220px'
    },
    divider: {
        paddingBottom: '5%'
    }
}));

const CredentialForm = (props) => {
    const classes = useStyles();

    return (
        <Container className={classes.root} >
            <Box border={1} borderColor="primary.light" borderRadius="borderRadius" justifyContent="center">
                <Box className={classes.header}>
                    <Typography variant="h6" gutterBottom>Sign Up</Typography>
                </Box>
                <Box className={classes.divider}>
                    <Divider />
                </Box>
                <form>
                    <Box className={classes.body}>
                        <TextField
                            required
                            id="outlined-required"
                            variant="outlined"
                            size="small"
                            label="Username"
                        />
                    </Box>
                    <Box className={classes.body}>
                        <TextField
                            required
                            id="outlined-required"
                            variant="outlined"
                            size="small"
                            label="Password"
                        />
                    </Box>
                    <Box className={classes.body}>
                        <input type="checkbox" name="remember" id="remember" />
                        <label for="remember" class="">Remember me</label>
                    </Box>
                    <Box className={classes.body}>
                        <Button className={classes.submitButton} variant="contained">Submit</Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
}

export default CredentialForm;