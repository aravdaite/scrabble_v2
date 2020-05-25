import React, { Component } from 'react';
import { Input, Button, WordList, Spinner } from '../components';
import User from '../user.png';
import { getData } from '../App'

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
        },
        name: "",
        email: "",
        sevenWords: [],
        freeWords: [],
        loading: false
    }
    componentDidMount() {
        this.setState({ loading: true });
        getData()
            .then(res => {
                if (res && res.success) {
                    console.log(res.data)
                    const { name, email, sevenLetterWords, freestyleWords } = res.data;
                    //let string = `, ${res.data.name}`;
                    this.setState({ name, email, sevenWords: sevenLetterWords, freeWords: freestyleWords, loading: false })
                }
            })
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
        const { change, name, email, sevenWords, freeWords, loading } = this.state;
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
                {loading ?
                    <Spinner />
                    :
                    <div className="row">
                        <div className="element">
                            <img className="Me__avatar" src={User} alt="user's avatar" />
                            <ul className="Me__info">
                                <li>Name: {name}</li>
                                <li>Email: {email}</li>
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

                            {freeWords ?
                                <WordList words={freeWords} />
                                :
                                ""}</div>
                        <div className="element">
                            <p>7 letter words you've unscrambled</p>
                            {sevenWords ?
                                <WordList words={sevenWords} />
                                :
                                ""}
                        </div>
                    </div>
                }
            </div >
        )
    }
}


export default Me;