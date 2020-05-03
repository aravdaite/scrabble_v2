import React, { Component } from 'react';
import { Button, Definitions, Spinner } from '../components'
import { getWordData } from '../containers/Freestyle'

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
        const categories = [];
        const definitions = [];

        getWordData(word).then(response => {
            response.forEach(res => {
                categories.push(res.fl)
                definitions.push(res.shortdef)
            })
            this.setState({ categories, definitions, loading: false })
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
                    {word !== null ? word.toLowerCase() : ''}
                    <Button type="showMeaning" onClick={() => this.showWordDescription(word)} />
                </li>
            )
            )

        return (
            <div className="WordList" >
                <h3>Words You've Made! </h3>
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