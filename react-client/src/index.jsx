import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';
import Signup from './components/Signup.jsx'
import '../dist/styles.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fighters: [],
      fighter: '',
      test: 0,
      view: 'signup'
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.removeHandler = this.removeHandler.bind(this);
    this.onBoxerSubmit = this.onBoxerSubmit.bind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/load',
      success: (data) => {
        console.log('component did mount data: \n', data)
        this.setState({
          fighters: data
        })
      },
      error: (err) => {
        console.log('error in loading data: \n', err)
      }
    })
  }

  onChange(val) {
    this.setState({
      fighter: val
    })
  }

  onSubmit() {
    console.log('searching for ufc')
    $.ajax({
      url: '/search',
      data: { fighter: this.state.fighter },
      success: (data) => {
        console.log('successfully submitted fighter', this.state)
        this.componentDidMount();
      },
      error: (err) => {
        console.log('error in search get request: \n', err)
      }
    })
  }

  onBoxerSubmit() {
    console.log('searching for boxer');
    $.ajax({
      url: '/boxer',
      data: { fighter: this.state.fighter },
      success: (data) => {
        console.log('successfully submitted boxer', data)
        this.componentDidMount();
      },
      error: (err) => {
        console.log('error in search get request: \n', err)
      }
    })
  }

  onClick() {
    $.ajax({
      url: '/refresh'
    })
  }

  removeHandler(name) {
    $.ajax({
      url: '/search',
      method: 'DELETE',
      data: { fighter: name },
      success: () => {
        this.componentDidMount();
      }
    })
  }

  render() {
    if (this.state.view === 'signup') {
      return (
        <Signup />
      )
    } else {

      return (
        <div>
          <h1>Fight Watch!</h1>
          <button>

          </button>
          <form>
            <input type='text' placeholder='insert fighter url...' onChange={(event) => {
              //</form>console.log(event.target)
              this.onChange(event.target.value);
            }}></input>

            <button onClick={(event) => {
              event.preventDefault();
              this.onBoxerSubmit()
            }
            }>Boxing</button>
            <button onClick={(event) => {
              event.preventDefault();
              this.onSubmit()
            }}>UFC</button>
          </form>
          <button onClick={(event) => {
            event.preventDefault();
            this.onClick()
          }}>TEST</button>
          <List items={this.state.fighters} removeHandler={this.removeHandler}></List>
        </div>
      )
    }
  }
}

ReactDOM.render(<App />, document.getElementById('app'));