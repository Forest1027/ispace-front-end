import { useState } from "react";
import { checkValidity, updateObject } from "../common/utility";
import CredentialForm from "../components/Auth/CredentialForm";

const Signup = (props) => {
    const [credentialItems, setCredentialItems] = useState({
        email: {
            value: '',
            type: 'email',
            name: 'email',
            display: 'Email',
            placeholder: 'Your Email',
            touched: false,
            valid: false,
            helpText: '',
            validation: {
                required: true,
                isEmail: true,
            }
        },
        password: {
            value: '',
            type: 'password',
            name: 'password',
            display: 'Password',
            placeholder: 'Your Password',
            touched: false,
            valid: false,
            helpText: '',
            validation: {
                required: true,
            }
        },
        confirmPassword: {
            value: '',
            type: 'password',
            name: 'confirmPassword',
            display: 'Confirm Password',
            placeholder: 'Confirm Password',
            touched: false,
            valid: false,
            helpText: '',
            validation: {
                required: true,
                sameAsPassword: true
            }
        },
        firstName: {
            value: '',
            type: 'text',
            name: 'firstName',
            display: 'First Name',
            placeholder: 'First Name',
            touched: false,
            valid: false,
            helpText: '',
            validation: {
                required: true,
            }
        },
        lastName: {
            value: '',
            type: 'text',
            name: 'lastName',
            display: 'Last Name',
            placeholder: 'Last Name',
            touched: false,
            valid: false,
            helpText: '',
            validation: {
                required: true,
            }
        },
        nickName: {
            value: '',
            type: 'text',
            name: 'nickName',
            display: 'Nickame',
            placeholder: 'Nickame',
            touched: false,
            valid: false,
            helpText: '',
        },
    })

    const [formIsValid, setFormIsValid] = useState(false);

    const onInputChangeHandler = (event) => {
        const name = event.target.name;
        const inputVal = event.target.value;
        const errorArr = checkValidity(inputVal, credentialItems[name].validation, credentialItems['password'].value)
        const helpText = errorArr.join(',');
        const updatedObj = updateObject(credentialItems, {
            [name]: updateObject(credentialItems[name], {
                value: inputVal,
                touched: true,
                valid: errorArr.length === 0,
                helpText: helpText
            })
        });
        let formValid = false;
        for (let key in updatedObj) {
            formValid = updatedObj[key].valid
        }
        setCredentialItems(updatedObj);
        setFormIsValid(formValid);
    };

    const onSubmitHandler = () => {
        props.onSubmit(credentialItems.email.value, credentialItems.password.value);
    };

    let form = (<CredentialForm changed={onInputChangeHandler} submitted={onSubmitHandler}
        formData={credentialItems} formValid={formIsValid} />);

    return (
        <div>
            {form}
        </div>
        
    );
};

export default Signup;