import React, { Component } from 'react';
import { Button, NavigationItem } from '../components';


class About extends Component {
    render() {

        return (
            <div className="About__mainBody">
                <h2>This is a simple scrabble game!</h2>
                <h3>How to play:</h3>
                <ul className="About__ul">
                    <li className="About__li">Use <strong>mouse</strong> or <strong>keyboard</strong> to make words from the letters given in the yellow squares</li>
                    <li className="About__li">Press on the square with the mouse or just press the corresponding key on the keyboard</li>
                    <li className="About__li">The word you've made will appear above the yellow letter-cards</li>
                    <li className="About__li">If created word is a valid word, the enter button will turn up green, like this: <Button type="enter" word={true} clickable={true} /></li>
                    <li className="About__li">Press the Enter button with the mouse or press the Enter key on your keyboard to add the word to the word list on the left</li>
                    <li className="About__li">You can see the meaning of the  word by clicking the Show meaning button next to it.  <Button type="showMeaning" /></li>

                </ul>
                <NavigationItem href="/" css_class="About__playLink">{"Play game now!"}</NavigationItem>
            </div>
        )
    }
}

export default About;