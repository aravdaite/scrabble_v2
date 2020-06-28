import React, { Component } from 'react';
import { Button, Spinner } from '../components';
import Freestyle from './Freestyle';
import Words7 from './Words7';
import Online from './Online';

export const fetchWords = () => {
    return fetch(`${process.env.REACT_APP_DOMAIN}/api/auth/words`, {
        credentials: 'include',
        method: 'get',
    })
        .then(res => res.json())
        .catch(err => {
            console.log(err);
        });
}
class Layout extends Component {

    state = {
        gameMode: 'online',
        wordListFree: [],
        wordListUnscramble: [],
        onlineWords: [],
        loading: false
    }

    componentDidMount = () => {
        this.setState({ loading: true });
        let data = [];
        let data2 = [];

        fetchWords()
            .then(res => {
                if (res && res.hasOwnProperty('data')) {
                    console.log(res.data[0])
                    data = [...res.data[0]];
                    data2 = [...res.data[1]];
                    this.setState({ wordListFree: data, wordListUnscramble: data2, loading: false })
                } else {
                    this.setState({ wordListFree: [], wordListUnscramble: [], loading: false })
                }
            })
    }

    addWord = (word, mode) => {
        console.log("Runs add word")
        if (mode === 'freestyle') {
            //put to the word list in DB
            fetch(`${process.env.REACT_APP_DOMAIN}/api/auth/addFreeWord`, {
                credentials: 'include',
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    word: word.toLowerCase(),
                })
            })
                .then(res => res.json())
                .then(res => {
                    if (res.hasOwnProperty('data')) {
                        const data = [...res.data];
                        this.setState({ wordListFree: data })
                    }
                })
                .catch(err => {
                    console.log(err);
                });

            //also put in the local word list
            const wordListFree = [...this.state.wordListFree]
            word = word.toLowerCase();
            if (wordListFree.includes(word)) {
                const index = wordListFree.indexOf(word);
                wordListFree.splice(index, 1);
                wordListFree.unshift(word);
                this.setState({ wordListFree })
            } else {
                wordListFree.unshift(word.toLowerCase());
                this.setState({ wordListFree })
            }
        }
        if (mode === "unscramble") {
            fetch(`${process.env.REACT_APP_DOMAIN}/api/auth/addSevenWord`, {
                credentials: 'include',
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    word: word,
                })
            })
                .then(res => res.json())
                .then(res => {
                    if (res.hasOwnProperty('data')) {
                        const data = [...res.data];
                        this.setState({ wordListUnscramble: data })
                    }
                })
                .catch(err => {
                    console.log(err);
                });

            const wordListUnscramble = [...this.state.wordListUnscramble]
            wordListUnscramble.unshift(word);
            this.setState({ wordListUnscramble })
        }
        if (mode === "online") {
            console.log("addWordruns")
            //put word in the local list, maybe screate add to the DB later
            const onlineWords = [...this.state.onlineWords]
            onlineWords.unshift(word);
            this.setState({ onlineWords })
        }
    }
    render() {
        const { gameMode, wordListFree, wordListUnscramble, loading, onlineWords } = this.state;
        return (

            <div>
                <div className="gameMode__Buttons">
                    <Button active={gameMode === 'freestyle'} type="gameMode" text="Free-Style" onClick={() => this.setState({ gameMode: 'freestyle' })} />
                    <Button active={gameMode === 'unscramble'} type="gameMode" text="Unscramble words" onClick={() => this.setState({ gameMode: 'unscramble' })} />
                    <Button active={gameMode === 'online'} type="gameMode" text="Online Multiplayer" onClick={() => this.setState({ gameMode: 'online' })} />
                </div>
                <div className="Scrabble__mainBody">
                    {loading ?
                        <Spinner />
                        :
                        gameMode === 'freestyle' ?
                            <Freestyle addWord={this.addWord} wordList={wordListFree} />
                            :
                            (gameMode === 'unscramble' ?
                                <Words7 addWord={this.addWord} wordList={wordListUnscramble} />
                                :
                                (gameMode === 'online' ?
                                    <Online addWord={this.addWord} wordList={onlineWords} name={this.props.name} />
                                    : ""))
                    }
                </div>
            </div >
        )
    }
}
export default Layout;