import React from 'react';
import styles from './Button.module.css';

const getButtonType = ({ type = '', ...rest }) => {
    const buttonDictionary = {
        enter: {
            className: rest.word ? (rest.clickable ? `${styles.enter} ${styles.green}` : styles.enter)
                : `${styles.enter} ${styles.none}`,
            text: 'Enter!'
        },
        exit: {
            className: styles.exit,
            text: 'X'
        },
        newGame: {
            className: styles.newGame,
            text: rest.text
        },
        shuffle: {
            className: styles.shuffle,
            text: 'Shuffle!'
        },
        showMeaning: {
            className: styles.showMeaning,
            text: rest.text
        },
        start: {
            className: rest.started ? `${styles.start} ${styles.started}` : styles.start,
            text: rest.text ? rest.text : 'Start Game!'
        },
        letterCard: {
            className: rest.letter ? styles.letterCard : `${styles.letterCard} ${styles.empty}`,
            text: rest.letter
        },
        letterCardOponent: {
            className: rest.letter ? (rest.won ? styles.letterCard
                : `${styles.letterCard} ${styles.oponentCard}`) : `${styles.letterCard} ${styles.empty}`,
            text: rest.letter
        },
        submit: {
            className: styles.submit,
            text: rest.text ? rest.text : "Submit"
        },
        gameMode: {
            className: rest.active ? `${styles.gameMode} ${styles.active}` : styles.gameMode,
            text: rest.text
        },
        logout: {
            className: styles.logout,
            text: "Logout"
        }
    }
    return buttonDictionary[type] || {}
}

export const Button = ({ onClick, ...props }) => (
    <button className={getButtonType(props).className}
        onClick={onClick}>{getButtonType(props).text}</button>
);
