import React, { Component } from 'react';
import { Input, Button } from '../../components';
import { DOMAIN } from '../../App';


class forgotPassword extends Component {

    state = {
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'email address'
            },
            value: ''
        },
        emailSent: false
    }
    inputChangedHandler = (event) => {
        const email = {
            ...this.state.email,
            value: event.target.value,
        };
        this.setState({ email }, () => console.log(this.state.email));
    }
    onSubmit = () => {
        fetch(`${DOMAIN}/api/auth/forgotpassword`, {
            credentials: 'include',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email.value,
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.data === 'Email sent') {
                    this.setState({ emailSent: true })
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
    render() {
        const { email, emailSent } = this.state;
        return (
            <div className="Scrabble__mainBody">
                {emailSent
                    ? <p>A link to reset your password has been sent to your email!</p>
                    : <div className="Register">
                        <p>Submit email to reset password:</p>
                        <Input
                            elementType={email.elementType}
                            elementConfig={email.elementConfig}
                            value={email.value}
                            changed={(event) => this.inputChangedHandler(event)} />
                        <Button type="submit" onClick={this.onSubmit} />
                    </div>
                }
            </div>
        )
    }
}
export default forgotPassword;