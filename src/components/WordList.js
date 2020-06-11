import React, { Component } from 'react';
import { Button, Definitions, Spinner } from '../components'
import { getWordData, getWordDataOxford } from '../containers/Freestyle'

export class WordList extends Component {
    state = {
        categories: [],
        definitions: [],
        modalOpened: false,
        loading: false
    }

    checkKeyEsc = (e) => {
        if (e.keyCode === 27) {
            this.setState({ modalOpened: false })
        }
    }

    openModal = () => {
        this.setState({ modalOpened: true })
        document.onkeydown = this.checkKeyEsc;
    }
    closeModal = () => this.setState({ modalOpened: false })

    getWordDesc = (word) => {
        this.setState({ loading: true });
        getWordDataOxford(word).then(res => {
            console.log(res)
            if (res !== undefined && res.success && res.response) {
                const { categories, definitions } = res.response;
                console.log("runs if", categories)
                this.setState({ categories, definitions, loading: false })
            } else {
                this.setState({ loading: false })
            }
        })
    }


    showWordDescription = (word) => {
        this.openModal()
        this.getWordDesc(word)
    }
    clearModal = () => {
        this.closeModal()
        this.setState({ definitions: [] })
    }

    render() {
        const { words } = this.props
        const { modalOpened, definitions, categories } = this.state
        const wordsList = words
            .map((word, index) => (
                <li className="WordList__item" key={index}>
                    <Button text={word !== null ? (typeof (word) == "string" ? word.toLowerCase() : (word.amount > 1 ? (word.word + " x" + word.amount) : word.word)) : ''}
                        type="showMeaning" onClick={() => { typeof (word) == "string" ? this.showWordDescription(word) : this.showWordDescription(word.word) }} />
                </li>
            )
            )

        return (
            <div>
                <ul>
                    {wordsList}
                </ul>
                <div className={modalOpened ? "backdrop" : "no-backdrop"}>
                    {this.state.loading ?
                        <Spinner />
                        :
                        <Definitions definitions={definitions} categories={categories}
                            onClick={this.clearModal} />
                    }
                </div>
            </div>
        )

    }
}