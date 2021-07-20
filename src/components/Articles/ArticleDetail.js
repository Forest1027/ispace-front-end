import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';
import {NavLink} from "react-router-dom";

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
        marginTop: theme.spacing(5),
    },
    cancelButton: {
        borderColor: '#660033',
        color: '#660033',
        width: 80,
        height: '100%',
        textAlign: 'left',
        marginRight: theme.spacing(1),
    },
    editButton: {
        backgroundColor: '#660033',
        color: 'white',
        width: 80,
        height: '100%',
        textAlign: 'left',
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

const ArticleDetail = () => {
    const classes = useStyles();
    let articleDetail = (
        <Box justifyContent="flex-start" width='80%'>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={this.createArticleHandler}>
                <Box className={classes.buttonBox}>
                    {this.props.readOnly ?
                        <Button className={classes.editButton} variant="contained"
                                onClick={this.props.onEditClicked}>Edit</Button>
                        : (
                            this.props.articleForm.articleId !== '' ?
                                (<div>
                                    <Button className={classes.editButton} variant="contained"
                                            onClick={this.updateArticleHandler}
                                            disabled={!this.props.formIsValid}>Update</Button>
                                    <Button className={classes.cancelButton}
                                            variant="outlined"
                                            onClick={this.props.onUpdateCancelClicked}>Cancel</Button>
                                </div>)
                                : (<div>
                                    <Button className={classes.editButton} variant="contained"
                                            onClick={this.createArticleHandler}
                                            disabled={!this.props.formIsValid}>Create</Button>
                                    <NavLink className={classes.link} to='/articles'> <Button
                                        className={classes.cancelButton}
                                        variant="outlined">Cancel</Button></NavLink>
                                </div>))
                    }

                </Box>
                <Box className={classes.title}>
                    <TextField id="standard-basic" label="Title" fullWidth name="title"
                               onChange={this.inputChangeHandler} defaultValue={this.props.articleForm.title}
                               inputProps={{readOnly: this.props.readOnly}}
                               error={!this.state.validation.title.valid && this.state.validation.title.touched}
                               helperText={(!this.state.validation.title.valid && this.state.validation.title.touched) ? "Cannot be empty" : ""}/>
                </Box>
                <Box>
                    <TextField id="standard-basic" label="One line description" fullWidth name="description"
                               onChange={this.inputChangeHandler}
                               defaultValue={this.props.articleForm.description}
                               inputProps={{readOnly: this.props.readOnly}}
                               error={!this.state.validation.description.valid && this.state.validation.description.touched}
                               helperText={(!this.state.validation.title.valid && this.state.validation.title.touched) ? "Cannot be empty" : ""}/>
                </Box>
                {/* <Box className={classes.editor}>
                    <CKEditor
                        data={this.props.articleForm.content}
                        editor={ClassicEditor}
                        config={{
                            removePlugins: ["ImageUpload"],
                        }}
                        onReady={editor => {
                            if (editor !== null) {
                                editor.isReadOnly = this.props.readOnly;
                                this.props.onInitEditor(editor);
                            }
                        }}
                        onChange={this.editorInputChangeHandler}
                        onBlur={(event, editor) => {
                            console.log('Blur.', editor);
                        }}
                        onFocus={(event, editor) => {
                            console.log('Focus.', editor);
                        }}
                    />
                </Box> */}
            </form>
        </Box>
    );
    return (
        <div>articel detail</div>
    )
};

export default ArticleDetail;