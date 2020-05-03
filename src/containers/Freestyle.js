import React, { Component } from 'react';
import { Button, WordList } from '../components';

const vowels = 'AEIOUY';
const consonants = 'BCDFGHJKLMNPQRSTVWXZ';
const key = "ee45ee9d-510f-4b5e-81f1-7bb7f90d3ffe";

export const getWordData = (word) => {
    return fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${key}`, {
        "method": "GET"
    })
        .then(res => res.json())
        .catch(err => {
            console.log(err);
        });
}
export const getWordDataOxford = (word) => {
    return fetch(`http://localhost:5000/api/dictionary/oxford/${word}`, {
        method: 'get'
    })
        .then(res => res.json())
        .catch(err => {
            console.log(err);
        });
}

export const shuffle = (letters) => {
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
}
export const removeFromArray = (array, index) => {
    array.splice(index, 1);
}

class Freestyle extends Component {

    state = {
        word: [], //word made from letters
        letterPosition: [], //from which position the letter was added to form a word, so it can be returned to the same position
        letters: [], //mixed letters
        isWord: false, //set of letters in word is an actual word
        //wordList: [], //array of all made words
        started: false,
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
        for (let i = 65; i < 91; i++) {
            if (e.keyCode === i && letters.includes(String.fromCharCode(i))) {
                const index = letters.indexOf(String.fromCharCode(i));
                this.putLetterToWord(index);
            }
        }
    }

    newGame = () => {
        // const wordList = [...this.state.wordList];
        this.setState({
            letters: [],
            word: [],
            isWord: false,
            letterPosition: [],
            // wordList,
            started: true
        })
        this.getLetters();
    }

    fillLetters = () => {

        let letters = [...this.state.letters];
        let vowelsNum = 0;
        let emptySlotsNum = 0;
        let randomVowelNum = this.getVowelNumber();

        //count how many empty slots and vowels are there 
        letters.forEach(letter => {
            if (letter === "A" || letter === "E" || letter === "I" || letter === "O" || letter === "U" || letter === "Y") {
                vowelsNum++;
            } else if (letter === "") {
                emptySlotsNum++;
            }
        })
        //fill vowels
        for (let m = randomVowelNum - vowelsNum; m > 0; m--) {
            letters[letters.indexOf('')] = vowels.charAt(Math.floor(Math.random() * vowels.length));
        }
        //fill left empty slots with consonants
        for (let j = emptySlotsNum - (vowelsNum - randomVowelNum); j > 0; j--) {
            letters[letters.indexOf('')] = consonants.charAt(Math.floor(Math.random() * consonants.length));
        }
        this.setState({ letters });
    }

    enterWord = () => {

        if (this.state.word !== '' && this.state.isWord === true) {
            let word = [...this.state.word];
            word = word.join('');
            this.props.addWord(word, 'freestyle');
            this.setState({ word: [], letterPosition: [], isWord: false });
            this.fillLetters();
        }
    }

    validateWord = (array) => {
        const word = array.join('');
        if (word !== "") {
            getWordDataOxford(word).then(res => {
                //if dictionary returns at least one lexical category, it is a word
                if (res.success) {
                    if (Object.keys(res.response).length === 0) {
                        this.setState({ isWord: false })
                    } else {
                        this.setState({ isWord: true })
                    }
                }
            })
        }
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
            this.setState({ word, letters, letterPosition });
            this.validateWord(word);
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


        this.setState({ letters: letters, isWord: false });
    }


    getLetters = () => {
        let result = '';
        let vowelString = '';
        let consonantString = '';
        const numVowels = this.getVowelNumber();
        const numConsonants = 7 - numVowels;

        for (let i = 0; i < numVowels; i++) {
            vowelString += vowels.charAt(Math.floor(Math.random() * vowels.length));
        }

        for (let i = 0; i < numConsonants; i++) {
            consonantString += consonants.charAt(Math.floor(Math.random() * consonants.length));
        }

        result = vowelString.concat(consonantString);
        this.setState({ letters: result, started: true }, () => this.shuffleLetters());
        document.onkeydown = this.checkKey;
    }

    getVowelNumber = () => {
        return Math.random() < 0.5 ? Math.random() < 0.5 ? 2 : 4 : 3;
    }

    render() {
        const { started, word, isWord, letters } = this.state;
        return (
            <div className="Scrabble__mainBody">
                <WordList words={this.props.wordList} />
                <div className="Scrabble__gameField">
                    <Button type="start" started={started} onClick={this.getLetters} />
                    {
                        this.state.started
                            ?
                            <div className="Scrabble__mainBox-started">
                                <p className="Scrabble__title"> Create a word!</p>
                                <div className="Scrabble__WordBox">

                                    {[...Array(7).keys()].map((index) =>
                                        <Button type="wordLetterCard" key={`${index.toString().concat(word[index])}`}
                                            letter={word[index]}
                                            onClick={() => this.removeLetterFromWord(index)} />)}

                                    <Button type="enter" onClick={this.enterWord} word={word[0]} clickable={isWord} />
                                </div>
                                <div className="Scrabble__LetterBox">
                                    {[...Array(7).keys()].map((index) =>
                                        <Button type="letterCard" key={`${index.toString().concat(word[index])}`}
                                            letter={letters[index]}
                                            onClick={() => this.putLetterToWord(index)} />)}
                                    <Button type="shuffle" onClick={this.shuffleLetters} />
                                </div>
                                <Button type="newGame" onClick={this.newGame} />
                            </div>
                            : ''
                    }
                </div>
            </div>
        );
    };
}
export default Freestyle;