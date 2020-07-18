import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import $ from 'jquery';
import List from './components/List.jsx';
import '../dist/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ListBoxer from './components/ListBoxer.jsx'
import RecruiterModal from './components/RecruiterModal.jsx'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fighters: [],
      boxers: [],
      fighter: '',
      test: '',
      users: 0
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.removeHandler = this.removeHandler.bind(this);
    this.onBoxerSubmit = this.onBoxerSubmit.bind(this);
    this.removeBoxer = this.removeBoxer.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.getUserCount = this.getUserCount.bind(this)
  }

  componentDidMount() {
    $.ajax({
      url: '/load',
      success: (data) => {
        data[0] = data[0].sort((a, b) => {
          if (a.next_fight === 'TBA') {
            return 1
          }
          if (b.next_fight === 'TBA') {
            return -1
          }
          return new Date(a.next_fight) - new Date(b.next_fight)
        })
        data[1] = data[1].sort((a, b) => {
          if (a.next_fight === 'TBA') {
            return 1
          }
          if (b.next_fight === 'TBA') {
            return -1
          }
          return new Date(a.next_fight) - new Date(b.next_fight)
        })
        console.log('component did mount data: \n', data)

        this.setState({
          fighters: data[0],
          boxers: data[1],
          test: data[2]
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
        alert("couldn't find mma fighter")
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
        alert("couldn't find boxer")
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

  removeBoxer(name) {
    $.ajax({
      url: '/boxer',
      method: 'DELETE',
      data: { fighter: name },
      success: () => {
        this.componentDidMount();
      }
    })
  }

  closeModal() {
    this.setState({
      test: 'Recruiter'
    })
  }

  getUserCount() {
    $.ajax({
      url: '/userCount',
      success: (data) => {
        console.log('dkjsdakufba')
        this.setState({
          users: data.stupid
        })
      }
    })
  }

  render() {

    return (
      <div>
        <RecruiterModal isOpen = {this.state.test === 'pleaseGive'} onAfterOpen = {this.getUserCount} users = {this.state.users} closeModal = {this.closeModal}></RecruiterModal>
        <p style={{ position: ' absolute', zIndex: '1', right: '10px', marginBottom: '0px', backgroundColor: 'rgb(179, 179, 179)', paddingLeft: '3px', paddingRight: '3px' }}><strong>Currently logged in as {this.state.test} </strong></p>
        <div className="input-group" style={{ position: ' absolute', zIndex: '1' }}>
          <div className="input-group-append" id="button-addon4" style={{ margin: '10px' }}>
            <form action='/logout' method='post'>
              <button className="btn btn-dark" type="submit">Log Out</button>
              <button className="btn btn-dark" type="button">Feedback</button>
            </form>
          </div>
        </div>
        <div style={{ backgroundColor: 'rgb(102, 102, 102)', paddingBottom: '10px', paddingTop: '10px', marginBottom: '10px' }}>
          <div className='mx-auto' style={{ backgroundColor: 'rgb(242, 242, 242)', width: 'max-content', padding: '10px' }}>
            <h1 style={{ textAlign: 'center' }}>F I G H T &nbsp;&nbsp;&nbsp; W A T C H</h1>

            <div className="input-group">
              <input type="text" className="form-control" placeholder="Fighter name" aria-label="Recipient's username with two button addons" aria-describedby="button-addon4" onChange={(event) => {
                this.onChange(event.target.value);
              }}></input>
              <div className="input-group-append" id="button-addon4">
                <button className="btn btn-dark" type="button" onClick={(event) => {
                  event.preventDefault();
                  this.onBoxerSubmit()
                }}>Boxing</button>
                <button className="btn btn-dark" type="button" onClick={(event) => {
                  event.preventDefault();
                  this.onSubmit()
                }}>UFC</button>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <List items={this.state.fighters} removeHandler={this.removeHandler}></List>
          </div>
          <div className="row">
            <ListBoxer items={this.state.boxers} removeHandler={this.removeBoxer}></ListBoxer>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));


/* <form className='mx-auto' style={{ position: 'relative', width: '300px' }}>
  <input type='text' placeholder='fighter name' onChange={(event) => {
    this.onChange(event.target.value);
  }}></input>

  <button className="btn btn-dark" onClick={(event) => {
    event.preventDefault();
    this.onBoxerSubmit()
  }}
  >Boxing</button>
  <button className="btn btn-dark" style ={{width: '10px'}} onClick={(event) => {
    event.preventDefault();
    this.onSubmit()
  }}>UFC</button>
</form> */