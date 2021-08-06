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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MySnackbar from "../UI/MySnackbar";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Progress from "../UI/Progress";
import { isNotNull, checkValidity, updateObject } from "../../common/utility";
import ErrorModal from "../UI/ErrorModal";
import FormHelperText from '@material-ui/core/FormHelperText';

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
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [editorState, setEditorState] = useState(createEditorStateWithText(""));
    const [isLoading, setIsLoading] = useState(true);
    const [toCancel, setToCancel] = useState(false);
    const [success, setSuccess] = useState(false);
    const [toSave, setToSave] = useState(false);
    const [categories, setCategories] = useState({ 'None': [{ 'id': '', 'categoryName': 'None' }] });
    const [categoryId, setCategoryId] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [error, setError] = useState(null);
    const [errorOpen, setErrorOpen] = useState(false);
    const [form, setForm] = useState({
        title: {
            touched: false,
            valid: false,
            helpText: '',
            validation: {
                required: true,
            }
        },
        description: {
            touched: false,
            valid: false,
            helpText: '',
            validation: {
                required: true,
            }
        },
        category: {
            touched: false,
            valid: false,
            helpText: '',
            validation: {
                required: true,
            }
        },
        content: {
            touched: false,
            valid: false,
            helpText: '',
            validation: {
                required: true,
            }
        }
    });
    const [formIsValid, setFormIsValid] = useState(false);
    const [updateFormIsValid, setUpdateFormIsValid] = useState(true);

    const { oktaAuth } = useOktaAuth();

    useConstructor(() => {
        if (props.location.state.mode === constants.MODE_EDIT) {
            axios.get(`http://localhost:8080/articleManagement/v1/articles/${props.location.state.articleId}`)
                .then(res => {
                    if (res.status === 200) {
                        setTitle(res.data.title);
                        setDescription(res.data.description);
                        setContent(res.data.content);
                        setCategoryId(res.data.articleCategory.id);
                        setEditorState(EditorState.createWithContent(stateFromHTML(res.data.content)))
                    }
                })
                .catch(error => {
                    if (isNotNull(error.response.data)) {
                        setError(error.response.data);
                    } else {
                        setError(error.message);
                    }
                    setErrorOpen(true);
                    setIsLoading(false);
                });
        }
        axios.get(`http://localhost:8080/articleManagement/v1/articleCategories/hierarchy`)
            .then(res => {
                setCategories(res.data);
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
            });

    });

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const inputVal = e.target.value;
        const errorArr = checkValidity(inputVal, form[name].validation, null);
        const helpText = errorArr.join(',');
        let resetObj;
        if (props.location.state.mode === constants.MODE_EDIT) {
            resetObj = updateObject(form, {
                title: {
                    touched: false,
                    valid: true,
                    helpText: '',
                    validation: {
                        required: true,
                    }
                },
                description: {
                    touched: false,
                    valid: true,
                    helpText: '',
                    validation: {
                        required: true,
                    }
                },
                category: {
                    touched: false,
                    valid: true,
                    helpText: '',
                    validation: {
                        required: true,
                    }
                },
                content: {
                    touched: false,
                    valid: true,
                    helpText: '',
                    validation: {
                        required: true,
                    }
                }
            })
        } else {
            resetObj = form;
        }
        const updatedObj = updateObject(resetObj, {
            [name]: updateObject(resetObj[name], {
                touched: true,
                valid: errorArr.length === 0,
                helpText: helpText
            })
        });
        let formValid = true;
        for (let key in updatedObj) {
            formValid = formValid && updatedObj[key].valid
        }
        setForm(updatedObj);
        if (props.location.state.mode === constants.MODE_EDIT) {
            setUpdateFormIsValid(formValid);
        } else {
            setFormIsValid(formValid);
        }


        if (name === "title") {
            setTitle(inputVal);
        } else if (name === "description") {
            setDescription(inputVal);
        } else if (name === "category") {
            setCategoryId(inputVal);
        }
    }

    const onEditorChangeHandler = (editorState) => {
        const updatedObj = updateObject(form, {
            content: updateObject(form.content, {
                touched: true,
                valid: isNotNull(editorState.getCurrentContent().getPlainText()),
            })
        });
        let formValid = true;
        for (let key in updatedObj) {
            formValid = formValid && updatedObj[key].valid
        }
        setForm(updatedObj);
        setFormIsValid(formValid);
        setEditorState(editorState);
        setContent(stateToHTML(editorState.getCurrentContent()));

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
            .catch(error => {
                const res = error.response.data;
                if (isNotNull(res) && isNotNull(res.errors)) {
                    setError(res.errors.map(msg => msg['defaultMessage']).join(", "));
                } else {
                    setError(error.message);
                }
                setErrorOpen(true);
                setIsLoading(false);
            });
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
            .catch(error => {
                const res = error.response.data;
                if (isNotNull(res) && isNotNull(res.errors)) {
                    setError(res.errors.map(msg => msg['defaultMessage']).join(", "));
                } else {
                    setError(error.message);
                }
                setErrorOpen(true);
                setIsLoading(false);
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
        handleCancelClose();
        history.push("/articleManagement");
    }

    const openSaveConfirm = () => {
        setToSave(true);
    }

    const confirmSave = () => {
        handleSaveClose();
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
                <Progress loading={isLoading} /> :
                (<div>
                    <form className={classes.root} noValidate autoComplete="off">
                        <div>
                            {props.location.state.mode === constants.MODE_CREATE ? <Button variant="outlined" color="secondary" className={classes.button} onClick={openSaveConfirm} disabled={!formIsValid}>Create</Button> : null}
                            {props.location.state.mode === constants.MODE_EDIT ? <Button variant="outlined" color="secondary" className={classes.button} onClick={openSaveConfirm} disabled={!updateFormIsValid}>Update</Button> : null}
                            <Button variant="outlined" color="primary" className={classes.button} onClick={onCancelHandler}>Cancel</Button>
                        </div>
                        <div>
                            <TextField
                                id="standard-basic"
                                label="Title"
                                fullWidth
                                name="title"
                                onChange={onChangeHandler}
                                value={title}
                                required
                                error={!form.title.valid && form.title.touched}
                                helperText={(!form.title.valid && form.title.touched) ? form.title.helpText : ""}
                            />
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
                                required
                                error={!form.description.valid && form.description.touched}
                                helperText={(!form.description.valid && form.description.touched) ? form.description.helpText : ""}
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
                                    required
                                    error={!form.category.valid && form.category.touched}
                                >
                                    {
                                        Object.keys(categories).map(element => {
                                            let items = (categories[element] !== null) ? categories[element].map(subCategory =>
                                                (<MenuItem key={subCategory.id} value={subCategory.id}>{subCategory.categoryName}</MenuItem >)
                                            ) : null
                                            return [<ListSubheader key={element}>{element}</ListSubheader>, items];
                                        })
                                    }
                                    <FormHelperText>{(!form.category.valid && form.category.touched) ? form.category.helpText : ""}</FormHelperText>
                                </Select>
                            </FormControl>
                        </div>
                        <div className={classes.editor}>
                            <MyEditor onChange={onEditorChangeHandler} editorState={editorState} />
                        </div>
                    </form>
                </div>)}
            <ErrorModal open={errorOpen} error={error} setOpen={setErrorOpen} />
            <MyDialog open={toCancel} handleClose={handleCancelClose} dialogTitle={"Change is not saved yet"}
                dialogContent={"Cancel update or create? The change won't be saved."} handleConfirm={confirmCancel} />
            <MyDialog open={toSave} handleClose={handleSaveClose} dialogTitle={"The content will be saved"}
                dialogContent={"Are you sure to save the content?"} handleConfirm={confirmSave} />
            <MySnackbar open={success} severity={"success"} setOpen={setSuccess} content={"The content has been saved. Redirecting to article list."} />
        </div>
    )
};

export default ArticleDetail;