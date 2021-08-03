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
import MyDialog from "../UI/MyDialog";
import { useOktaAuth } from '@okta/okta-react';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MySnackbar from "../UI/MySnackbar";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import NativeSelect from '@material-ui/core/NativeSelect';
import { isElement } from "react-dom/cjs/react-dom-test-utils.production.min";
import ListSubheader from '@material-ui/core/ListSubheader';

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
    formControl: {
        minWidth: 120,
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
    const [toCancel, setToCancel] = useState(false);
    const { authState, oktaAuth } = useOktaAuth();
    const [success, setSuccess] = useState(false);
    const [toSave, setToSave] = useState(false);
    const [categories, setCategories] = useState({ 'None': [{ 'id': '', 'categoryName': 'None' }] });
    const [categoryId, setCategoryId] = useState('');
    const [categoryOpen, setCategoryOpen] = useState(false);

    useConstructor(() => {
        if (props.location.state.mode === constants.MODE_EDIT) {
            axios.get(`http://localhost:8080/articleManagement/v1/articles/${props.location.state.articleId}`)
                .then(res => {
                    setTitle(res.data.title);
                    setDescription(res.data.description);
                    setContent(res.data.content);
                    setEditorState(EditorState.createWithContent(stateFromHTML(res.data.content)))

                })
                .catch(error => {
                    setIsLoading(false);
                    console.log(error)
                });
        }
        axios.get(`http://localhost:8080/articleManagement/v1/articleCategories/hierarchy`)
            .then(res => {
                console.log(res.data)
                setCategories(res.data);
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
            });

    });

    const onChangeHandler = (e) => {
        console.log(e.target.name);
        const name = e.target.name
        if (name === "title") {
            setTitle(e.target.value);
        } else if (name === "description") {
            setDescription(e.target.value);
        } else if (name === "category") {
            setCategoryId(e.target.value);
        }
    }

    const onCreateHandler = () => {
        const accessToken = `Bearer ${oktaAuth.getAccessToken()}`;
        axios.post(
            `http://localhost:8080/articleManagement/v1/articles`,
            {
                title: title,
                description: description,
                content: content,
                articleCategory: {
                    id: categoryId
                }
            },
            {
                headers:
                {
                    'Authorization': accessToken,
                }
            })
            .then(res => {
                setSuccess(true);
                setTimeout(() => {
                    history.push("/articleManagement");
                }, 1000);
            })
            .catch(err => {

            });
    }

    const onEditorChangeHandler = (editorState) => {
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
                content: content,
                articleCategory: {
                    id: categoryId
                }
            },
            {
                headers:
                {
                    'Authorization': accessToken,
                }
            })
            .then(res => {
                setSuccess(true);
                setTimeout(() => {
                    history.push("/articleManagement");
                }, 1000);
            })
            .catch(err => {

            })
    }

    const handleCategoryClose = () => {
        setCategoryOpen(false);
    };

    const handleCategoryOpen = () => {
        setCategoryOpen(true);
    };

    const onCancelHandler = () => {
        setToCancel(true);
    }

    const confirmCancel = () => {
        history.push("/articleManagement");
    }

    const openSaveConfirm = () => {
        setToSave(true);
    }

    const confirmSave = () => {
        setIsLoading(true);
        if (props.location.state.mode === constants.MODE_CREATE) {
            onCreateHandler();
        } else if (props.location.state.mode === constants.MODE_EDIT) {
            onUpdateHandler();
        }
    }

    const handleCancelClose = () => {
        setToCancel(false);
    };

    const handleSaveClose = () => {
        setToSave(false);
    }

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
                            {props.location.state.mode === constants.MODE_CREATE ? <Button variant="outlined" color="secondary" className={classes.button} onClick={openSaveConfirm}>Create</Button> : null}
                            {props.location.state.mode === constants.MODE_EDIT ? <Button variant="outlined" color="secondary" className={classes.button} onClick={openSaveConfirm}>Update</Button> : null}
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
                        <div>
                            <FormControl className={classes.formControl} fullWidth>
                                <InputLabel id="demo-controlled-open-select-label">Category</InputLabel>
                                <Select
                                    id="grouped-select"
                                    name="category"
                                    open={categoryOpen}
                                    onClose={handleCategoryClose}
                                    onOpen={handleCategoryOpen}
                                    onChange={onChangeHandler}
                                    value={categoryId}
                                >
                                    {
                                        Object.keys(categories).map(element => {
                                            let items = (categories[element] !== null) ? categories[element].map(subCategory =>
                                                (<MenuItem key={subCategory.id} value={subCategory.id}>{subCategory.categoryName}</MenuItem >)
                                            ) : null
                                            return [<ListSubheader key={element}>{element}</ListSubheader>, items];
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <div className={classes.editor}>
                            <MyEditor onChange={onEditorChangeHandler} editorState={editorState} />
                        </div>
                    </form>
                </div>)}
            <MyDialog open={toCancel} handleClose={handleCancelClose} dialogTitle={"Change is not saved yet"}
                dialogContent={"Cancel update or create? The change won't be saved."} handleConfirm={confirmCancel} />
            <MyDialog open={toSave} handleClose={handleSaveClose} dialogTitle={"The content will be saved"}
                dialogContent={"Are you sure to save the content?"} handleConfirm={confirmSave} />
            <MySnackbar open={success} severity={"success"} content={"The content has been saved. Redirecting to article list."} />
        </div>
    )
};

export default ArticleDetail;