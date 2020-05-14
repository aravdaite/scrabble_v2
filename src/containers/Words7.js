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
    }

    getWord = () => {

        fetch(`${process.env.REACT_APP_DOMAIN}/api/words/findword7`, {
            method: 'get',
        })
            .then(res => res.json())
            .then(res => {
                if ((res.hasOwnProperty('word')) && res.word.hasOwnProperty('words')) {
                    console.log(res.word.words)
                    const arr = [...Array.from(res.word.words)]
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
        const word2 = word.join('');
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
        let { word, originalWord } = this.state;
        word = [...this.state.word];
        word = word.join('');
        if (word === originalWord) {
            this.props.addWord(word, '');
            this.setState({ word: [], letterPosition: [], letters: [], originalWord: [], rightWord: false });
            this.getWord();
        }
    }
    openModal = () => {
        this.setState({ modalOpened: true })
        document.onkeydown = this.checkKeyEsc;
    }
    closeModal = () => {
        this.getWord();
        this.setState({ modalOpened: false })
    }
    unscrambleWord = () => {
        this.openModal();
    }
    render() {
        const { word, letters, rightWord, started, originalWord, modalOpened } = this.state;
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
                        <Button type="start" started={started} onClick={this.getWord} />
                        {
                            this.state.started
                                ?
                                <div className="Scrabble__mainBox-started">
                                    <p className="Scrabble__title"> Unscramble the word!</p>
                                    <div className="Scrabble__WordBox">

                                        {[...Array(7).keys()].map((index) =>
                                            <Button type="wordLetterCard" key={`${index.toString().concat(word[index])}`}
                                                letter={word[index]}
                                                onClick={() => this.removeLetterFromWord(index)} />)}

                                        <Button type="enter" onClick={this.enterWord} word={word[0]} clickable={rightWord} />
                                    </div>
                                    <div className="Scrabble__LetterBox">
                                        {[...Array(7).keys()].map((index) =>
                                            <Button type="letterCard" key={`${index.toString().concat(word[index])}`}
                                                letter={letters[index]}
                                                onClick={() => this.putLetterToWord(index)} />)}
                                        <Button type="shuffle" onClick={this.shuffleLetters} />
                                    </div>
                                    <div>
                                        <Button type="newGame" onClick={this.getWord} text="Get a new word!" />
                                        <Button type="newGame" onClick={this.unscrambleWord} text="Unscramble!" />
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

