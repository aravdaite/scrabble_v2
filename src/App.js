import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Layout from './containers/Layout';
import About from './containers/About';
import Me from './containers/Me';
import Register from './containers/auth/Register';
import Login from './containers/auth/Login';
import forgotPassword from './containers/auth/forgotPassword';
import resetPassword from './containers/auth/resetPassword';
import { Toolbar, Footer } from './components';

export const getData = () => {
  console.log(process.env.REACT_APP_DOMAIN)
  return fetch(`${process.env.REACT_APP_DOMAIN}/api/auth/me`, {
    credentials: 'include',
    method: 'get',
  })
    .then(res => res.json())
    .catch(err => {
      console.log(err);
    });
}
class App extends Component {

  state = {
    name: "",
    logedIn: false
  }

  componentDidMount() {

    fetch(`${process.env.REACT_APP_DOMAIN}/api/auth/me`, {
      credentials: 'include',
      method: 'get',
    })
      .then(res => res.json())
      .then(res => {
        if (res && res.success) {
          console.log(res.data)
          //let string = `, ${res.data.name}`;
          this.setState({ name: res.data.name, logedIn: res.success })
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ name: "", logedIn: false });
        alert("The server has crashed!")
      });


  }

  render() {
    const { name, logedIn } = this.state;
    return (
      <div className="body" >
        <BrowserRouter>
          <Toolbar name={name !== "" ? ", " + name : ""} login={logedIn} />
          <Route exact path="/"  ><Layout name={name !== "" ? name : ""} /></Route >
          <Route exact path="/me" component={Me} />
          <Route path="/about" component={About} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/forgotpassword" component={forgotPassword} />
          <Route path="/resetpassword/:token" component={resetPassword} />
        </BrowserRouter>
        <Footer />
      </div>
    )
  }
}
export default App;
