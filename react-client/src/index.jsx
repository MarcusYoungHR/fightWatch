import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';
import '../dist/styles.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fighters: [],
      fighter: '',
      test: 0
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.removeHandler = this.removeHandler.bind(this);
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
    $.ajax({
      url: '/search',
      data: {fighter: this.state.fighter},
      success: (data) => {
        console.log('successfully submitted fighter', this.state)
        this.componentDidMount();
      },
      error: (err) => {
        console.log('error in search get request: \n', err)
      }
    })
  }

  onClick() {
    $.ajax({
      url: '/test'
    })
  }

  removeHandler(name) {
    $.ajax({
      url: '/search',
      method: 'DELETE',
      data: {fighter: name},
      success: ()=> {
        this.componentDidMount();
      }
    })
  }

  render() {
    return (
    <div>
      <form  onSubmit={(event) => {
          event.preventDefault();
          this.onSubmit();
        }}>
        <input type='text' placeholder='insert fighter url...' onChange={(event) => {
          //</form>console.log(event.target)
          this.onChange(event.target.value);
        }}></input>
        <input type='submit' value='search'></input>
      </form>
      <button onClick={() => {
        this.onClick()
      }
      }>show state</button>
      <List items={this.state.fighters} removeHandler={this.removeHandler}></List>
    </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));