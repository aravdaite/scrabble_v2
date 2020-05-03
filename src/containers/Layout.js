import React, { Component } from 'react';
import { Button } from '../components';
import Freestyle from './Freestyle';
import Words7 from './Words7';

class Layout extends Component {

    state = {
        gameMode: 'freestyle',
        wordListFree: [],
        wordList7: [],
    }

    componentDidMount = () => {

        fetch('http://localhost:5000/api/auth/words', {
            method: 'get',
        })
            .then(res => res.json())
            .then(res => {
                console.log(res.data)
                const data = [...res.data[0]];
                const data2 = [...res.data[1]];
                this.setState({ wordListFree: data, wordList7: data2 })
            })
            .catch(err => {
                console.log(err);
            });

    }

    addWord = (word, mode) => {
        if (mode === 'freestyle') {

            if (this.state.name !== '') {
                fetch('http://localhost:5000/api/auth/addFreeWord', {
                    method: 'put',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        word: word,
                    })
                })
                    .then(res => res.json())
                    .then(res => {
                        console.log(res.data)
                        const data = [...res.data];
                        this.setState({ wordListFree: data })
                    })
                    .catch(err => {
                        console.log(err);
                    });

                //   } else {
                const wordListFree = [...this.state.wordListFree]
                wordListFree.unshift(word);
                this.setState({ wordListFree })
            }
        } else {
            const wordList7 = [...this.state.wordList7]
            wordList7.unshift(word);
            this.setState({ wordList7 })
        }
    }

    render() {
        const { gameMode, wordListFree, wordList7 } = this.state;
        return (
            <div>
                <div className="gameMode__Buttons">
                    <Button type="gameMode" text="Free-Style" onClick={() => this.setState({ gameMode: 'freestyle' })} />
                    <Button type="gameMode" text="7 Letter Words" onClick={() => this.setState({ gameMode: 'letters7' })} />
                </div>
                <div className="Scrabble__mainBody">
                    {gameMode === 'freestyle' ?
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