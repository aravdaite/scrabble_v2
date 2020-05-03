import React from 'react';

export const Input = (props) => {
    return (
        <div className='Input'>
            <label className='Input__label'>{props.label}</label>
            <input
                className='Input__inputField'
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />
        </div>
    )
}