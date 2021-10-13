import React from 'react';
import Article from './components/Article/Article.jsx';

class Detail extends React.Component {

    constructor(props) {
        super(props)

        //state
        this.state = {
            id: this.props.match.params.id
        }
    }

    render() {

        var { id } = this.state

        return (

            <div id='EL-Detail'>
                <Article id={id} />
            </div>

        )
    }
}

export default Detail;
