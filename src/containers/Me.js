import React, { Component } from 'react';
import { Input, Button, WordList } from '../components';
import User from '../user.png'

export const changePass = (currentPassword, password) => {
    return fetch(`${process.env.REACT_APP_DOMAIN}/api/auth/updatepassword`, {
        credentials: 'include',
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: password

        })
    })
        .then(res => res.json())
        .catch(err => {
            console.log(err);
        });
}
class Me extends Component {
    state = {
        change: false,
        controls: {
            currentPassword: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'old password'
                },
                value: '',
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'new password'
                },
                value: '',
            }
        }
    }

    changePassword = () => {
        this.setState({ change: true })
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
        changePass(this.state.controls.currentPassword.value, this.state.controls.password.value)
            .then(res => {
                if (res.success) {
                    window.location.href = "/me"
                } else {
                    window.alert("Not succeeded. Please try again!")
                }
            })
    }
    render() {
        const { data } = this.props;
        const { change } = this.state;
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }
        const form = formElementsArray.map(formElement => (
            <Input
                class={"Me__input"}
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                changed={(event) => this.inputChangedHandler(event, formElement.id)} />
        ));

        return (
            <div className="About__mainBody">
                <h2>Welcome to your dashboard: </h2>
                <div className="row">
                    <div className="element">
                        <img className="Me__avatar" src={User} alt="user's avatar" />
                        <ul className="Me__info">
                            <li>Name: {data.name}</li>
                            <li>Email: {data.email}</li>
                            {change ?
                                <div>
                                    {form}
                                    <Button type="submit" onClick={this.onSubmit} />
                                </div>
                                :
                                <li><Button text="Change password" type="submit" onClick={() => this.changePassword()} /></li>

                            }
                        </ul>
                    </div>
                    <div className="element">
                        <p>Freestyle words you've made</p>


                        <ul>
                            {data.freestyleWords ?

                                <WordList words={this.props.data.freestyleWords} />

                                :
                                ""}</ul></div>
                    <div className="element">
                        <p>7 letter words you've unscrambled</p>
                        <ul>
                            {data.sevenLetterWords ?
                                <WordList words={this.props.data.sevenLetterWords} />
                                :
                                ""}</ul>
                    </div>
                </div>
            </div >
        )
    }
}


export default Me;