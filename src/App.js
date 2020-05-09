import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Layout from './containers/Layout';
import About from './containers/About';
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
    name: '',
    logedIn: false
  }

  componentDidMount() {

    getData()
      .then(res => {
        if (res && res.success) {
          let string = `, ${res.data.name}`;
          this.setState({ name: string, logedIn: res.success })
        }
      })
  }

  render() {
    return (
      <div className="body" >
        <BrowserRouter>
          <Toolbar name={this.state.name} login={this.state.logedIn} />
          <Route exact path="/" component={Layout} />
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
