import React, { Component } from 'react';
import { Input, Button, Spinner } from '../../components';
import { NavLink } from 'react-router-dom';


export const log = (email, password) => {
    return fetch(`${process.env.REACT_APP_DOMAIN}/api/auth/login`, {
        credentials: 'include',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: email,
            password: password

        })
    })
        .then(res => res.json())
        .catch(err => {
            console.log(err);
        });
}
class Login extends Component {

    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'email address'
                },
                value: '',
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'password'
                },
                value: '',
            }
        },
        loading: false
    }

    inputChangedHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
            }
        };
        this.setState({ controls: updatedControls });
    }

    onSubmit = () => {
        this.setState({ loading: true });
        log(this.state.controls.email.value, this.state.controls.password.value)
            .then(res => {
                if (res && res.success) {
                    this.setState({ loading: false });
                    window.location.href = "/"
                } else {
                    this.setState({ loading: false }, () => window.alert("Login credentials were incorrect. Please try again!"));
                }
            })
    }
    render() {
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }
        const form = formElementsArray.map(formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                changed={(event) => this.inputChangedHandler(event, formElement.id)} />
        ));
        return (
            <div>
                {this.state.loading ?
                    <Spinner />
                    :
                    <div className="Register">
                        {form}
                        <Button type="submit" onClick={this.onSubmit} />
                        <NavLink exact to='/forgotpassword' className="Register__link">Forgot your password?</NavLink>
                    </div>}
            </div>
        )
    }
}
export default Login;