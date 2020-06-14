import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';
import '../dist/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ListBoxer from './components/ListBoxer.jsx'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fighters: [],
      boxers: [],
      fighter: '',
      test: 0,
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
        var mmaGuys = [];
        var boxingGuys = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].style === 'mma') {
            mmaGuys.push(data[i])
          } else {
            boxingGuys.push(data[i])
          }
        }
        this.setState({
          fighters: mmaGuys,
          boxers: boxingGuys
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

    return (
      <div>
        <div style={{ backgroundColor: 'rgb(168, 36, 36)', paddingBottom: '10px', paddingTop: '10px', marginBottom: '10px'}}>
          <div className='mx-auto' style={{backgroundColor: 'rgb(242, 242, 242)', width: 'max-content', padding: '10px'}}>
            <h1 style={{ textAlign: 'center' }}>F I G H T &nbsp;&nbsp;&nbsp; W A T C H</h1>

            <form className='mx-auto' style={{ position: 'relative', width: '300px' }}>
              <input type='text' placeholder='fighter name' onChange={(event) => {
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
          </div>
        </div>

        <div className="container">
          <div className="row">
            <List items={this.state.fighters} removeHandler={this.removeHandler}></List>
            <ListBoxer items={this.state.boxers} removeHandler={this.removeHandler}></ListBoxer>
          </div>

        </div>

      </div>
    )

  }
}

ReactDOM.render(<App />, document.getElementById('app'));