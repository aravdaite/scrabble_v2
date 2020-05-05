import React from 'react';
import { Logo, NavigationItem } from '../../components';

const logout = () => {
    fetch('https://scrabble-api21.herokuapp.com/api/auth/logout', {
        method: 'get',
    })
        .then(res => {
            if (res) {
                window.location.reload();
            }
        })
        .catch(err => {
            console.log(err);
        });
}


export const Toolbar = ({ name, login }) => (
    <header className="header">
        <div className="logo-welcome">
            <Logo />
            <div className="ToolbarText">{`Welcome to scrabble trainer${name}!`}</div>
        </div>
        <nav className="navigation">
            <ul className="navigation-list">
                <li><NavigationItem href="/" css_classActive="NavigationItem-active" css_class="NavigationItem">{"Game"} </NavigationItem></li>
                <li><NavigationItem href="/about" css_classActive="NavigationItem-active" css_class="NavigationItem">{"About"}</NavigationItem></li>
                {login ?
                    <li><a onClick={() => logout()} className="NavigationItem">Logout</a></li>
                    :
                    <div>
                        <li><NavigationItem href="/register" css_classActive="NavigationItem-active" css_class="NavigationItem">{"Register"}</NavigationItem></li>
                        <li><NavigationItem href="/login" css_classActive="NavigationItem-active" css_class="NavigationItem">{"Login"}</NavigationItem></li>
                    </div>
                }
            </ul>
        </nav>
    </header>
);