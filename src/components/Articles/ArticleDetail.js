import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';
import MyEditor from "./MyEditor";
import { EditorState } from 'draft-js';
import { stateToHTML } from "draft-js-export-html";
import { Button } from "@material-ui/core";
import * as constants from '../../common/Constants';
import useConstructor from "../../hooks/useConstructor";
import axios from "axios";
import { createEditorStateWithText } from '@draft-js-plugins/editor';
import { stateFromHTML } from 'draft-js-import-html'
import { useHistory } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useOktaAuth } from '@okta/okta-react';
import { convertFromHTML, ContentState, convertToRaw } from "draft-js";
import { convertFromRaw } from "draft-js";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(2),
        },
    },

    margin: {
        margin: theme.spacing(1),
    },
    editor: {
        marginTop: theme.spacing(8),
    },
    cancelButton: {
        borderColor: '#660033',
        color: '#660033',
        width: 80,
        height: '100%',
        textAlign: 'left',
        marginRight: theme.spacing(1),
    },
    button: {
        marginRight: theme.spacing(1),
    },
    buttonBox: {
        textAlign: 'left',
    },
    link: {
        textDecoration: 'none'
    },
    '@media (min-width:550px)': {
        title: {
            width: '25ch',
        },
    }
}));

const ArticleDetail = (props) => {
    const classes = useStyles();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [editorState, setEditorState] = useState(createEditorStateWithText(""));
    const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const { authState, oktaAuth } = useOktaAuth();

    useConstructor(() => {
        axios.get(`http://localhost:8080/articleManagement/v1/articles/${props.location.state.articleId}`)
            .then(res => {
                setTitle(res.data.title);
                setDescription(res.data.description);
                setContent(res.data.content);
                setEditorState(EditorState.createWithContent(stateFromHTML(res.data.content)))
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                console.log(error)
            });

    });

    const onChangeHandler = (e) => {
        console.log(e.target.name);
        const name = e.target.name
        if (name === "title") {
            setTitle(e.target.value);
        } else if (name === "description") {
            setDescription(e.target.value);
        }
    }

    const onCreateHandler = () => {
        const accessToken = `Bearer ${oktaAuth.getAccessToken()}`;
        axios.post(
            `http://localhost:8080/articleManagement/v1/articles`,
            {
                title: title,
                description: description,
                content: content
            },
            {
                headers:
                {
                    'Authorization': accessToken,
                }
            })
            .then(res => {
                history.push("/articleManagement");
            })
            .catch(err => {

            });
    }

    const onEditorChangeHandler = (editorState) => {
        console.log("update")
        console.log(JSON.stringify(stateToHTML(editorState.getCurrentContent())))
        setEditorState(editorState);
        setContent(stateToHTML(editorState.getCurrentContent()));

    }

    const onUpdateHandler = () => {
        const accessToken = `Bearer ${oktaAuth.getAccessToken()}`;
        axios.put(
            `http://localhost:8080/articleManagement/v1/articles`,
            {
                id: props.location.state.articleId,
                title: title,
                description: description,
                content: content
            },
            {
                headers:
                {
                    'Authorization': accessToken,
                }
            })
            .then(res => {
                history.push("/articleManagement");
            })
            .catch(err => {

            })
    }

    const onCancelHandler = () => {
        setOpen(true);
    }

    const confirmCancel = () => {
        history.push("/articleManagement");
    }

    const handleClose = () => {
        setOpen(false);
    };

    const leavePageHandler = (e) => {
        e = e || window.event;

        // For IE and Firefox
        if (e) {
            e.returnValue = 'Leaving the page';
        }

        // For Safari
        return 'Leaving the page';
    }

    window.onbeforeunload = leavePageHandler;

    return (
        <div>
            {isLoading ?
                <div>Loading...</div> :
                (<div>
                    <form className={classes.root} noValidate autoComplete="off">
                        <div>
                            {props.location.state.mode === constants.MODE_CREATE ? <Button variant="outlined" color="secondary" className={classes.button} onClick={onCreateHandler}>Create</Button> : null}
                            {props.location.state.mode === constants.MODE_EDIT ? <Button variant="outlined" color="secondary" className={classes.button} onClick={onUpdateHandler}>Update</Button> : null}
                            <Button variant="outlined" color="primary" className={classes.button} onClick={onCancelHandler}>Cancel</Button>
                        </div>
                        <div>
                            <TextField id="standard-basic" label="Title" fullWidth name="title" onChange={onChangeHandler} value={title} />
                        </div>
                        <div>
                            <TextField
                                id="standard-textarea"
                                label="Description"
                                name="description"
                                fullWidth
                                multiline
                                onChange={onChangeHandler}
                                value={description}

                            />
                        </div>
                        <div className={classes.editor}>
                            <MyEditor onChange={onEditorChangeHandler} editorState={editorState} />
                        </div>
                    </form>

                    {props.location.state.articleId}
                </div>)}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"The change is not saved yet"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Cancel update or create? The change won't be saved.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        No
                    </Button>
                    <Button onClick={confirmCancel} color="secondary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <div>
                {props.location.state.author}
            </div>
        </div>
    )
};

export default ArticleDetail;