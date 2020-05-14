import React from 'react';

const getButtonType = ({ type = '', ...rest }) => {
    const buttonDictionary = {
        enter: {
            className: rest.word ? rest.clickable ? "Button__enter-green" : "Button__enter" : "Button__enter-none",
            text: 'Enter!'
        },
        exit: {
            className: 'Button__exit',
            text: 'X'
        },
        newGame: {
            className: 'Button__newGame',
            text: rest.text
        },
        shuffle: {
            className: 'Button__shuffle',
            text: 'Shuffle!'
        },
        showMeaning: {
            className: 'Button__ShowMeaning',
            text: rest.text
        },
        start: {
            className: rest.started ? "Button__start-started" : "Button__start",
            text: 'Start Game!'
        },
        letterCard: {
            className: 'Button__LetterCard',
            text: rest.letter
        },
        wordLetterCard: {
            className: rest.letter ? "Button__WordLetterCard" : "Button__WordLetterCard-empty",
            text: rest.letter
        },
        submit: {
            className: "Button__submit",
            text: rest.text ? rest.text : "Submit"
        },
        gameMode: {
            className: rest.active ? "Button__gameMode-active" : "Button__gameMode",
            text: rest.text
        }
    }
    return buttonDictionary[type] || {}
}

export const Button = ({ onClick, ...props }) => (
    <button className={getButtonType(props).className}
        onClick={onClick}>{getButtonType(props).text}</button>
);
