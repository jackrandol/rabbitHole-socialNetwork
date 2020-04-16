import React from "react";
import axios from './axioscopy';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (!this.props.bio) {
            this.setState({ addButtonVisible: true });
        } else {
            this.setState({ bioVisible: true });
        }
    }

    handleClick() {
        console.log('add bio clicked!');
        this.setState({ bioVisible: false });
        this.setState({ bioEditorVisible: true });
        this.setState({ addButtonVisible: false });
    }

    handleSave() {
        console.log('save button clicked');
        axios.post('/bio', this.state).then(response => {
            this.props.setBio(response.data.rows[0].bio);
        });
        this.setState({ bioEditorVisible: false });
        this.setState({ bioVisible: true });

    }


    handleChange(e) {
        this.setState({
            bioInputField : e.target.value
        }, () => console.log('this.state: ', this.state)
        );
    }

    render() {
        return (


            <div>
                <h1>Bio</h1>
                { this.state.bioVisible &&
                    <>
                    <p> { this.props.bio } </p>
                    <button onClick={ this.handleClick } >edit bio</button>
                    </>

                }

                { this.state.addButtonVisible &&
                    <button onClick={this.handleClick}
                    className='addBioButton'>
                    add bio
                    </button>
                }

                { this.state.bioEditorVisible &&
                    <div>
                        <textarea onChange={ this.handleChange } className='textArea'>{ this.props.bio }</textarea>
                        <button onClick={ this.handleSave } >save</button>
                    </div>
                }
            </div>
        );
    }
}
