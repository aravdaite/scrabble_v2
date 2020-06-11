import React, { Component } from 'react';
import { Button, Spinner } from '../components';
import Freestyle from './Freestyle';
import Words7 from './Words7';

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
        gameMode: 'freestyle',
        wordListFree: [],
        wordListUnscramble: [],
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
                    this.setState({ wordListFree: data, wordList7: data2, loading: false })
                } else {
                    this.setState({ wordListFree: [], wordList7: [], loading: false })
                }
            })
    }

    addWord = (word, mode) => {
        if (mode === 'freestyle') {

            if (this.state.name !== '') {
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

                //   } else {
                const wordListFree = [...this.state.wordListFree]
                wordListFree.unshift(word.toLowerCase());
                this.setState({ wordListFree })
            }
        } else {
            if (this.state.name !== '') {
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
                            this.setState({ wordList7: data })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });

                //   } else {
                const wordList7 = [...this.state.wordListUnscramble]
                wordList7.unshift(word);
                this.setState({ wordList7 })
            }
        }
    }

    render() {
        const { gameMode, wordListFree, wordList7, loading } = this.state;
        return (

            <div>
                <div className="gameMode__Buttons">
                    <Button active={gameMode === 'freestyle'} type="gameMode" text="Free-Style" onClick={() => this.setState({ gameMode: 'freestyle' })} />
                    <Button active={gameMode === 'letters7'} type="gameMode" text="Unscramble words" onClick={() => this.setState({ gameMode: 'letters7' })} />
                </div>
                <div className="Scrabble__mainBody">
                    {loading ?
                        <Spinner />
                        :
                        gameMode === 'freestyle' ?
                            <Freestyle addWord={this.addWord} wordList={wordListFree} />
                            :
                            <Words7 addWord={this.addWord} wordList={wordList7} />

                    }


                </div>
            </div >
        )
    }
}
export default Layout;