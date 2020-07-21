import React, { Component } from 'react';
import { Button, WordList } from '../components';
import { shuffle, removeFromArray } from './Freestyle';


class Words7 extends Component {

    state = {
        word: [], //player's unscrabled word
        letterPosition: [], //from which position the letter was added to form a word, so it can be returned to the same position
        letters: [], //mixed letters
        rightWord: false, //set of letters in word is an actual word
        originalWord: "",
        // wordList: [], //array of all made words
        started: false,
        modalOpened: false,
        wordLetterNum: 7  //how many letters in a word
    }
    checkKey = (e) => {
        const { letters, word } = this.state

        if (word !== 0) {
            if (e.keyCode === 8) {
                this.removeLetterFromWord(word.length - 1);
            }
            if (e.keyCode === 46) {
                this.removeLetterFromWord(0);
            }
            else if (e.keyCode === 13) {
                e.preventDefault();
                this.enterWord();
            }
        }
        if (letters.includes(String.fromCharCode(e.keyCode))) {
            const index = letters.indexOf(String.fromCharCode(e.keyCode));
            this.putLetterToWord(index);
        }
    }
    componentDidMount = () => {
        document.onkeydown = this.checkKey;
    }
    //get word with the right number of letters
    getWord = (number) => {
        fetch(`${process.env.REACT_APP_DOMAIN}/api/words/findword/${number}`, {
            method: 'get',
        })
            .then(res => res.json())
            .then(res => {
                if ((res.hasOwnProperty('word')) && res.word.hasOwnProperty('words')) {
                    const arr = [...Array.from(res.word.words.toUpperCase())]
                    shuffle(arr);
                    this.setState({ originalWord: res.word.words, letters: arr, started: true, word: [], letterPosition: [], rightWord: false });
                }
            })
    }
    putLetterToWord = (index) => {

        if (this.state.letters[index] !== '') {
            const word = [...this.state.word];
            const letterPosition = [...this.state.letterPosition];
            const letters = [...this.state.letters];

            word.push(letters[index]);
            letterPosition.push(index);
            letters[index] = '';

            this.setState({ word, letterPosition, letters });
            this.validateWord(word);
        }
    }
    removeLetterFromWord = (index) => {

        if (index < this.state.word.length) {
            const word = [...this.state.word];
            const letters = [...this.state.letters];
            const letterPosition = [...this.state.letterPosition];
            const letter = this.state.word[index];
            const pos = this.state.letterPosition[index];
            letters[pos] = letter;
            removeFromArray(word, index);
            removeFromArray(letterPosition, index);
            this.validateWord(word);
            this.setState({ word, letters, letterPosition });
        }
    }
    validateWord = (word) => {
        const word2 = word.join('').toLowerCase();
        if (word2 === this.state.originalWord) {
            this.setState({ rightWord: true });
        } else {
            this.setState({ rightWord: false });
        }
    }
    shuffleLetters = () => {
        const letters = [...this.state.letters];
        //if this.state.word is not empty, return letters to their places before shuffling
        if (this.state.word.length !== 0) {
            let word = [...this.state.word];
            for (let i = 0; i < word.length; i++) {
                const pos = this.state.letterPosition[i];
                const letter = this.state.word[i];
                letters[pos] = letter;
            }
            this.setState({ word: [], letterPosition: [] });
        }
        shuffle(letters);
        this.setState({ letters: letters, rightWord: false });
    }
    enterWord = () => {
        let { word, originalWord, wordLetterNum } = this.state;
        word = [...this.state.word];
        word = word.join('').toLowerCase();
        if (word === originalWord) {
            this.props.addWord(word, 'unscramble');
            this.setState({ word: [], letterPosition: [], letters: [], originalWord: [], rightWord: false });
            this.getWord(wordLetterNum);
        }
    }
    openModal = () => {
        this.setState({ modalOpened: true })
        document.onkeydown = this.checkKeyEsc;
    }
    closeModal = () => {
        this.getWord(this.state.wordLetterNum);
        this.setState({ modalOpened: false })
    }

    render() {
        const { word, letters, rightWord, started, originalWord, modalOpened, wordLetterNum } = this.state;
        return (
            modalOpened ?
                <div className={modalOpened ? "backdrop" : "no-backdrop"}>
                    <div className="Unscrambled">
                        <div className="Unscrambled-data">
                            <strong className="Definitions__strong">Unscrambled word:</strong>
                            {originalWord}
                        </div>
                        <Button type="exit" onClick={() => this.closeModal()} />
                    </div>
                </div>
                :
                <div className="Scrabble__mainBody">
                    <div className="WordList" >
                        <h3>Words You've Made! </h3>
                        <WordList words={this.props.wordList} />
                    </div>
                    <div className="Scrabble__gameField">
                        <div className="letterNum">
                            <p className="howMany">  How many letters?</p>
                            {[...Array(3).keys()].map((index) =>
                                <Button active={wordLetterNum === index + 5} type="gameMode" text={index + 5}
                                    onClick={() => { this.setState({ wordLetterNum: index + 5 }, () => started ? this.getWord(index + 5) : "") }} />
                            )}
                        </div>
                        {<Button type="start" started={started} onClick={() => this.getWord(wordLetterNum)} />
                        }
                        {
                            started
                                ?
                                <div className="Scrabble__mainBox-started">
                                    <p className="Scrabble__title"> Unscramble the word!</p>
                                    <div className="Scrabble__WordBox">

                                        {[...Array(word.length).keys()].map((index) =>
                                            <Button type="letterCard" key={`${index.toString().concat(word[index])}`}
                                                letter={word[index]}
                                                onClick={() => this.removeLetterFromWord(index)} />)}

                                        <Button type="enter" onClick={this.enterWord} word={word[0]} clickable={rightWord} />
                                    </div>
                                    <div className="Scrabble__LetterBox">
                                        {[...Array(letters.length).keys()].map((index) =>
                                            <Button type="letterCard" key={`${index.toString().concat(word[index])}`}
                                                letter={letters[index]}
                                                onClick={() => this.putLetterToWord(index)} />)}
                                        <Button type="shuffle" onClick={this.shuffleLetters} />
                                    </div>
                                    <div>
                                        <Button type="newGame" onClick={() => this.getWord(wordLetterNum)} text="Get a new word!" />
                                        <Button type="newGame" onClick={this.openModal} text="Unscramble!" />
                                    </div>
                                </div>
                                : ''
                        }

                    </div>
                </div>
        );
    };
}
export default Words7;

