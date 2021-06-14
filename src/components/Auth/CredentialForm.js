import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '400px',
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
        [theme.breakpoints.up('sm')]: {
            width: '220px',
        },
    },
    divider: {
        paddingBottom: '5%'
    },
    inputClass: {

        [theme.breakpoints.up('sm')]: {
            width: '300px',
            fullWidth: true,
        },
    },
    boxBorder: {
        [theme.breakpoints.up('sm')]: {
            border: '1px',
            borderStyle: 'solid',
            borderColor: "#e0e0e0",
            borderRadius: "5px",
        },
    },
}));

const CredentialForm = (props) => {
    const classes = useStyles();

    return (
        <Container className={classes.root} >
            <Box className={classes.boxBorder} justifyContent="center">
                <Box className={classes.header}>
                    <Typography variant="h6">Sign Up</Typography>
                </Box>
                <Box className={classes.divider}>
                    <Divider />
                </Box>
                <form>
                    {Object.keys(props.formData).map(fieldName => (
                        <Box className={classes.body} key={fieldName}>
                            <TextField
                                id={props.formData[fieldName].name}
                                label={props.formData[fieldName].placeholder}
                                variant="outlined"
                                className={classes.inputClass}
                                onChange={props.changed}
                                name={props.formData[fieldName].name}
                                type={props.formData[fieldName].type}
                                error={!props.formData[fieldName].valid && props.formData[fieldName].touched}
                                helperText={(!props.formData[fieldName].valid && props.formData[fieldName].touched) ? props.formData[fieldName].helpText : ""}
                                size="small"
                                value={props.formData[fieldName].value}
                            />
                        </Box>
                    ))}
                    <Box className={classes.body}>
                        <input type="checkbox" name="remember" id="remember" />
                        <label>Remember me</label>
                    </Box>
                    <Box className={classes.body}>
                        <Button className={classes.submitButton} variant="contained" onClick={props.submitted} disabled={!props.formValid}
                        >Submit</Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
}

export default CredentialForm;