import React from 'react';
import { Logo, NavigationItem } from '../../components';

const logout = () => {
    fetch(`${process.env.REACT_APP_DOMAIN}/api/auth/logout`, {
        credentials: 'include',
        method: 'get',
    })
        .then(res => {
            if (res) {
                window.location.href = "/"
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
                    <div>
                        <li><NavigationItem href="/me" css_classActive="NavigationItem-active" css_class="NavigationItem">{"Me"}</NavigationItem></li>
                        <li><button onClick={() => logout()} className="NavigationItem-button">Logout</button></li>
                    </div>
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