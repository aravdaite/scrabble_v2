import React from 'react';

export const Input = (props) => {
    return (
        <div className='Input'>

            <input
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed} />
        </div>
    )
}