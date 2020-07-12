import React, { Component } from 'react';
import { Button, WordList, Spinner, Counter } from '../components';
import { shuffle, removeFromArray } from './Freestyle';
import socketIOClient from "socket.io-client";

let socket = socketIOClient(process.env.REACT_APP_DOMAIN);
let roomNo = "";

class Words7 extends Component {

    state = {
        oponentLetters: [],
        oponentWord: "",
        word: [], //player's unscrabled word
        letterPosition: [], //from which position the letter was added to form a word, so it can be returned to the same position
        letters: [], //mixed letters
        rightWord: false, //has the player unscrabled the wirte word?
        originalWord: "", //original word that the players are trying to unscramble
        // wordList: [], //array of all made words
        modalOpened: false,
        wordLetterNum: 7,  //how many letters in a word
        gameState: "notStarted", //game state
        validated: false, //game over?
        wins: 0,
        oponentWins: 0,
        spinner: false
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
    //make sure player is disconnected from the game propertly
    componentWillUnmount() {
        socket.emit("leave", { room: roomNo });
    }
    componentDidMount() {
        document.onkeydown = this.checkKey;
        //check if the oponent made a move and update oponen't cards
        socket.on("word", data => {
            this.setState({ oponentWord: data });
        });
        socket.on("letters", data => {
            this.setState({ oponentLetters: data }, () => console.log(this.state.oponentLetters, this.state.oponentWord));
        });

        //check if oponent has won
        socket.on("status", data => {
            const { oponentWins } = this.state
            this.setState({ gameState: "oponentWon", validated: true, oponentWins: (oponentWins + 1), modalOpened: true })
            setTimeout(() => this.setState({ gameState: "oponentFound", modalOpened: true }), 3000);
        });

        //start a new game after losing
        socket.on("newWord", data => {
            const arr = [...Array.from(data.word[0].words)]
            console.log(arr)
            shuffle(arr);

            this.setState({ gameState: "getReady", modalOpened: true });
            setTimeout(this.restartGame, 3500, arr, data);
        });

        //be prompted that other player disconnected
        socket.on("oponentLeft", data => {
            this.setState({
                gameState: "oponentDisconnected", oponentLetters: [], oponentWord: [], originalWord: "",
                letters: [], word: [], letterPosition: [], rightWord: false, modalOpened: true
            });
        })
    }

    //start game and get the first word
    startGame = (number) => {
        if (this.state.gameState === "notStarted") {
            this.setState({ spinner: true });
            this.setState({ gameState: "oponentFound" }, () => {
                //join existing room as player2
                socket.emit("joinGame", "playerName");
                socket.on("player", data => {
                    if (data) {
                        roomNo = data.room;
                        const arr = [...Array.from(data.word[0].words.toUpperCase())]
                        console.log(arr)
                        shuffle(arr);

                        this.setState({
                            gameState: "oponentFound", spinner: false,
                            oponentLetters: arr, originalWord: data.word[0].words,
                            letters: arr, word: [], letterPosition: [], rightWord: false, validated: false
                        });
                    }
                })
            });
            //cannot join an existing room? create a new game room and join as player1
            socket.on("err", data => {
                if (data === 'Sorry, The room is full!' && !this.state.oponent) {
                    socket.emit("createGame", "playerName");
                    socket.on("newGame", data => {
                        roomNo = data.room;
                    })
                }
                this.setState({ gameState: "started", spinner: false });
            })
        }
    }
    //restart game
    getNewWord = () => {
        socket.emit("newWord", roomNo);
    }
    restartGame = (arr, data) => {
        this.setState({
            gameState: "oponentFound", validated: false,
            oponentLetters: arr, oponentWord: [],
            originalWord: data.word[0].words, letters: arr,
            word: [], letterPosition: [], rightWord: false
        })
    }
    putLetterToWord = (index) => {
        if (this.state.validated === false) {
            if (this.state.letters[index] !== '') {
                const word = [...this.state.word];
                const letterPosition = [...this.state.letterPosition];
                const letters = [...this.state.letters];

                word.push(letters[index]);
                letterPosition.push(index);
                letters[index] = '';

                this.setState({ word, letterPosition, letters }, () => {
                    socket.emit("word", { room: roomNo, word: word });
                    socket.emit("letters", { room: roomNo, letters: letters });
                });
                this.validateWord(word);

            }
        }
    }
    removeLetterFromWord = (index) => {
        if (this.state.validated === false) {
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

                this.setState({ word, letters, letterPosition }, () => {
                    socket.emit("word", { room: roomNo, word: word });
                    socket.emit("letters", { room: roomNo, letters: letters });
                }
                );
            }
        }
    }
    //check if it's correct word
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
        socket.emit("word", { room: roomNo, word: [] });
        socket.emit("letters", { room: roomNo, letters: letters });
    }
    //enter word to he list, game over and update score
    enterWord = () => {
        let { word, originalWord, wins } = this.state;
        word = [...this.state.word];
        word = word.join('').toLowerCase();
        if (word === originalWord) {

            this.props.addWord(word, 'online');
            this.setState({ validated: true, wins: (wins + 1), gameState: "youWon", modalOpened: true });
            setTimeout(() => this.setState({ gameState: "oponentFound", modalOpened: true }), 3000);
            //this.getWord(wordLetterNum);
            socket.emit("won", { room: roomNo, message: "The PlayerName has won" });
        }
    }

    openModal = () => {
        this.setState({ modalOpened: true })
        document.onkeydown = this.checkKeyEsc;
    }
    closeModal = () => {
        let nextState;
        const { gameState } = this.state;
        gameState === "oponentDisconnected" ? nextState = "started" : nextState = "oponentFound";
        //this.getWord(this.state.wordLetterNum);
        this.setState({ modalOpened: false, gameState: nextState })
    }

    getGameState = (state) => {
        const { word, letters, rightWord, oponentLetters, originalWord,
            oponentWord, validated, oponentWins, wins, modalOpened } = this.state;

        const gameState = {
            notStarted:
            <Button type="start" text="Start" started={false} onClick={() => this.startGame()} />
            ,
            started: <div className="Scrabble__mainBox-started">
                <p className="textWhite size28">Waiting for an oponent to connect!</p>
                <Button type="start" text="Retry" started={false} onClick={() => this.startGame()} />
            </div>
            ,
            oponentFound: <div className="Scrabble__mainBox-started">
                <p className="textWhite">Wins: You: {wins} Oponent: {oponentWins} </p>
                <p className="Scrabble__title"> Oponent: {this.props.name}</p>

                <div className="Scrabble__LetterBox">
                    {//oponent letter cards
                        [...Array(oponentLetters.length).keys()].map((index) =>
                            <Button type="letterCardOponent" won={validated} key={`${index.toString().concat(word[index])}`}
                                letter={oponentLetters[index]}
                            />)}
                </div>
                <div className="Scrabble__WordBox oponentBox">

                    {//oponent made up word
                        [...Array(oponentWord.length).keys()].map((index) =>
                            <Button type="letterCardOponent" won={validated} key={`${index.toString().concat(word[index])}`}
                                letter={oponentWord[index]}
                            />)}
                </div>
                <p className="Scrabble__title"> Unscramble the word!</p>
                <div className="Scrabble__WordBox">

                    {//player's made up word
                        [...Array(word.length).keys()].map((index) =>
                            <Button type="letterCard" key={`${index.toString().concat(word[index])}`}
                                letter={word[index]}
                                onClick={() => this.removeLetterFromWord(index)} />)}
                    {validated ? '' : <Button type="enter" onClick={this.enterWord} word={word[0]} clickable={rightWord} />}
                </div>
                <div className="Scrabble__LetterBox">
                    {//player's letter cards
                        [...Array(letters.length).keys()].map((index) =>
                            <Button type="letterCard" key={`${index.toString().concat(word[index])}`}
                                letter={letters[index]}
                                onClick={() => this.putLetterToWord(index)} />)}
                    {validated ? ""
                        : <Button type="shuffle" onClick={this.shuffleLetters} />}
                </div>
                {validated ? <Button type="start" text="Play again!" started={false} onClick={() => this.getNewWord()} />
                    : ""}
            </div>,
            oponentWon:
            <div className={modalOpened ? "backdrop" : "no-backdrop"}>
                <div className="Unscrambled">
                    <div className="Unscrambled-data">
                        <strong className="Definitions__strong">Oponent Won!</strong>
                        <strong className="Definitions__strong">{originalWord.toUpperCase()}</strong>
                    </div>
                    <Button type="exit" onClick={() => this.closeModal()} />
                </div>

            </div>,
            youWon:
            <div className={modalOpened ? "backdrop" : "no-backdrop"}>
                <div className="Unscrambled">
                    <div className="Unscrambled-data">
                        <strong className="Definitions__strong">You won!</strong>
                    </div>
                    <Button type="exit" onClick={() => this.closeModal()} />
                </div>
            </div>,
            oponentDisconnected:
            <div className={modalOpened ? "backdrop" : "no-backdrop"}>
                <div className="Unscrambled">
                    <div className="Unscrambled-data">
                        <strong className="Definitions__strong">Oponent has disconnected!</strong>
                    </div>
                    <Button type="exit" onClick={() => this.closeModal()} />
                </div>
            </div>,
            getReady:
            <div className={modalOpened ? "backdrop" : "no-backdrop"}>
                <div className="Unscrambled">
                    <div className="Unscrambled-data">
                        <p>Get ready!</p>
                        <Counter />
                    </div>
                </div>
            </div>,
        }
        return gameState[state] || {}
    }

    render() {
        const { gameState, modalOpened, spinner } = this.state;

        window.addEventListener("beforeunload", (ev) => {
            socket.emit("leave", { room: roomNo })
        });
        return (
            <div className="Scrabble__mainBody" >
                <div className="WordList" >
                    <h3>Words You've Made! </h3>
                    <WordList words={this.props.wordList} />
                </div>
                <div className="Scrabble__gameField">
                    {spinner ?
                        <Spinner />
                        :
                        this.getGameState(gameState)}
                </div>
            </div>
        );
    };
}
export default Words7;