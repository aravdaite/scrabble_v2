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
        const categories = [];
        const definitions = [];
        getWordDataOxford(word).then(res => {
            if (res && res.response[0]) {
                console.log("runs here 2")
                for (let index in res.response) {
                    for (let cat in res.response[index]) {
                        categories.push(cat);
                        definitions.push(res.response[index][cat])
                    }
                }
                this.setState({ categories, definitions, loading: false })
            } else {
                getWordData(word).then(response => {
                    console.log("runs here ", response)
                    if (response && response.length !== 20) {
                        console.log("runs here ", response)
                        // categories.push(`From ${response[0].meta.id}`)
                        response.forEach(res => {
                            console.log("runs here ", res.meta.id)
                            categories.push(`from "${res.meta.id.replace(/[0-9]/g, '').replace(/:/g, '')}"`)
                            definitions.push([])
                            categories.push(res.fl)
                            definitions.push(res.shortdef)
                        })

                        console.log("runs here3 ", categories, definitions)
                        this.setState({ categories, definitions, loading: false })
                    } else {
                        this.setState({ categories, definitions, loading: false })
                    }
                })
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

                    <Button text={word !== null ? word.toLowerCase() : ''} type="showMeaning" onClick={() => this.showWordDescription(word)} />
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