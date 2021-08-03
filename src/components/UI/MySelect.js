import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
    },
}));

const MySelect = (props) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="demo-controlled-open-select-label">Category</InputLabel>
            <Select
                labelId="demo-controlled-open-select-label"
                name="category"
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                onChange={props.handleChange}
                value={props.category}
            >
                {
                    Object.keys(props.categories).map(element =>
                    (
                        <div key={element}><ListSubheader>{element}</ListSubheader>
                            {
                                (props.categories[element] !== null) ?
                                    props.categories[element].map(subCategory =>
                                        (<MenuItem key={subCategory.id} value={subCategory.id}>{subCategory.categoryName}</MenuItem >)
                                    ) : null
                            }
                        </div>)
                    )
                }
            </Select>
        </FormControl>
    )
};

export default MySelect;