import { useState } from "react";
import { checkValidity, updateObject } from "../common/utility";
import CredentialForm from "../components/Auth/CredentialForm";
import * as constants from '../common/Constants';
import axios from "axios";
import ErrorModal from "../components/UI/ErrorModal";
import { isNotNull } from "../common/utility";

const Signup = (props) => {
    const [credentialType] = useState(constants.SIGNUP);
    const [open, setOpen] = useState(false);
    const [registered, setRegistered] = useState(false);
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
            valid: true,
            helpText: '',
            validation: {
            }
        },
    });

    const [formIsValid, setFormIsValid] = useState(false);
    const [error, setError] = useState("");

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
        let formValid = true;
        for (let key in updatedObj) {
            formValid = formValid && updatedObj[key].valid
        }
        setCredentialItems(updatedObj);
        setFormIsValid(formValid);
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        const userInfo =
        {
            firstName: credentialItems['firstName'].value,
            lastName: credentialItems['lastName'].value,
            nickName: credentialItems['nickName'].value,
            password: credentialItems['password'].value,
            email: credentialItems['email'].value
        };
        axios.post('http://localhost:8080/userManagement/v1/users/register', userInfo)
            .then(res => {
                if (res.status === 200) {
                    setRegistered(true)
                    setTimeout(() => {
                        props.history.push('/login')
                    }, 3000);
                } 
            })
            .catch(error => {
                const errRes = error.response.data;
                if (isNotNull(errRes)) {
                    const causes = errRes.errorCauses;
                    if (isNotNull(causes)) {
                        setError(causes.map(cause => cause['errorSummary']).join());
                    }else if (isNotNull(errRes.errors)) {
                        setError(errRes.errors.map(msg => msg['defaultMessage']).join());
                    }else {
                        setError(error.message);
                    }
                }
                setOpen(true)
            });
    };

    let form = (<CredentialForm changed={onInputChangeHandler} submitted={onSubmitHandler}
        formData={credentialItems} formValid={formIsValid} formType={credentialType} />);
    return (
        <div>
            <ErrorModal open={open} setOpen={setOpen} error={error} />
            {!registered ? form : (<div>
                <div>
                    <h3>Successfully registered. Redirecting to login page...</h3>
                </div>
            </div>)}
        </div>

    );
};

export default Signup;