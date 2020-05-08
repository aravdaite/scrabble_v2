import React, { Component } from 'react';
import { Input, Button } from '../../components';
import { DOMAIN } from '../../App';

class resetPassword extends Component {

    state = {
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'password'
            },
            value: ''
        },
        reset: ''
    }
    inputChangedHandler = (event) => {
        const password = {
            ...this.state.password,
            value: event.target.value,
        };
        this.setState({ password }, () => console.log(this.state.password.value));
    }
    onSubmit = () => {
        const token = this.props.match.params.token;
        fetch(`${DOMAIN}/api/auth/resetpassword/${token}`, {
            credentials: 'include',
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password: this.state.password.value,
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.sucess === true) { this.setState({ reset: "Your password has been reset!" }) }
                else { this.setState({ reset: "There was a problem reseting your password. Please try again." }) }
            })
            .catch(err => {
                console.log(err);
            });
    }
    render() {
        const { password, reset } = this.state;
        return (
            <div className="Scrabble__mainBody">
                {reset === ''
                    ? <div className="Register">
                        <p>Please put in the new password:</p>
                        <Input
                            elementType={password.elementType}
                            elementConfig={password.elementConfig}
                            value={password.value}
                            changed={(event) => this.inputChangedHandler(event)} />
                        <Button type="submit" onClick={this.onSubmit} />  </div>
                    : <p>{reset}</p>
                }
            </div>
        )
    }
}
export default resetPassword;