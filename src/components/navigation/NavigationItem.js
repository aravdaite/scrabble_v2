import React from 'react';
import { NavLink } from 'react-router-dom';

export const NavigationItem = ({ href, css_classActive, css_class, children }) => <NavLink exact to={href} activeClassName={css_classActive} className={css_class}>{children}</NavLink>
