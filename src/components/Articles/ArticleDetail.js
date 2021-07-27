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
    const onEditorChangeHandler = (editorState) => {
        setEditorState(editorState);
        setContent(JSON.stringify(stateToHTML(editorState.getCurrentContent())));
    }
    return (
        <div>
            {isLoading ?
                <div>Loading...</div> :
                (<div>
                    <form className={classes.root} noValidate autoComplete="off">
                        <div>
                            {props.location.state.mode === constants.MODE_CREATE ? <Button variant="outlined" color="secondary" className={classes.button} >Create</Button> : null}
                            {props.location.state.mode === constants.MODE_EDIT ? <Button variant="outlined" color="secondary" className={classes.button} >Update</Button> : null}
                            <Button variant="outlined" color="primary" className={classes.button}>Cancel</Button>
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

            <div>
                {props.location.state.author}
            </div>
        </div>
    )
};

export default ArticleDetail;