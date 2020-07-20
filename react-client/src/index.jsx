import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import $ from 'jquery';
import List from './components/List.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../dist/styles.css'
import ListBoxer from './components/ListBoxer.jsx'
import RecruiterModal from './components/RecruiterModal.jsx'
import FeedbackModal from './components/FeedbackModal.jsx'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fighters: [],
      boxers: [],
      fighter: '',
      test: '',
      users: 0,
      message: '',
      feedBack: false
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.removeHandler = this.removeHandler.bind(this);
    this.onBoxerSubmit = this.onBoxerSubmit.bind(this);
    this.removeBoxer = this.removeBoxer.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.getUserCount = this.getUserCount.bind(this)
    this.dateSorter = this.dateSorter.bind(this)
    this.messageHandler = this.messageHandler.bind(this)
    this.feedbackSubmit = this.feedbackSubmit.bind(this)
  }

  componentDidMount() {
    $.ajax({
      url: '/load',
      success: (data) => {
        data[0] = this.dateSorter(data[0])
        data[1] = this.dateSorter(data[1])
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

  dateSorter(arr) {
    return arr.sort((a, b) => {
      if (a.next_fight === 'TBA') {
        return 1
      }
      if (b.next_fight === 'TBA') {
        return -1
      }
      return new Date(a.next_fight) - new Date(b.next_fight)
    })
  }

  onSubmit() {
    console.log('searching for ufc')
    $.ajax({
      url: '/search',
      data: { fighter: this.state.fighter },
      success: (data) => {
        console.log('successfully submitted fighter', this.state, '\ndata\n', data)
        let tempArr = this.state.fighters.slice()
        tempArr.push(data)
        tempArr = this.dateSorter(tempArr)
        this.setState((prevState) => (
          { fighters: tempArr }
        ))
        //this.componentDidMount();
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
        let tempArr = this.state.boxers.slice()
        tempArr.push(data)
        tempArr = this.dateSorter(tempArr)
        this.setState((prevState) => (
          { boxers: tempArr }
        ))
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
      test: 'Recruiter',
      feedBack: false,
      message: ''
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

  messageHandler(value) {
    this.setState({
      message: value
    })
  }

  feedbackSubmit() {
    $.ajax({
      url: '/feedback',
      method: 'POST',
      data: {message: this.state.message},
      success: (data)=> {
        this.setState({
          message: '',
          feedBack: false
        })
      }
    })
  }

  render() {

    return (
      <div>
        <RecruiterModal isOpen={this.state.test === 'pleaseGive'} onAfterOpen={this.getUserCount} users={this.state.users} closeModal={this.closeModal}></RecruiterModal>

        <FeedbackModal isOpen={this.state.feedBack} message={this.state.message} closeModal={this.closeModal} changeHandler={this.messageHandler} submitHandler={this.feedbackSubmit}></FeedbackModal>

        <div className='container-fluid' style={{ backgroundColor: 'rgb(138, 3, 3)', paddingBottom: '10px', paddingTop: '10px', marginBottom: '10px' }}>
          <div className='row'>
            <div className='col'>

                <h1 style={{ color: 'rgb(230, 230, 230)', fontWeight: 'bold', display: 'inline-block', transform: 'translateY(30%)' }}>FIGHT &nbsp; WATCH</h1>
                <img src='./images/logo2.png' style={{ width: '4em', display: 'inline-block'}}></img>


            </div>

            <div className='col'>
              <div className='mx-auto' style={{ width: 'max-content', padding: '10px', transform: 'translateY(20%)' }}>
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="insert fighter name" aria-label="Recipient's username with two button addons" aria-describedby="button-addon4" onChange={(event) => {
                    this.onChange(event.target.value);
                  }}></input>
                  <div className="input-group-append" id="button-addon4">
                    <button className="btn btn-dark" type="button" onClick={(event) => {
                      event.preventDefault();
                      this.onSubmit()
                    }}>Search UFC</button>
                    <button className="btn btn-dark" type="button" onClick={(event) => {
                      event.preventDefault();
                      this.onBoxerSubmit()
                    }}>Search Boxing</button>
                  </div>
                </div>
              </div>
            </div>

            <div className='col'>
              <div style={{ float: 'right' }}>
                <p style={{ color: 'rgb(230, 230, 230)', marginBottom: '0px' }}><strong>Currently logged in as {this.state.test} </strong></p>
                <div className="input-group" >
                  <div className="input-group-append" id="button-addon4" style={{ margin: '10px' }}>
                    <form action='/logout' method='post'>
                      <button className="btn btn-dark" type="submit">Log Out</button>
                      <button className="btn btn-dark" type="button" onClick={(event)=> {
                        event.preventDefault()
                        this.setState({
                          feedBack: true
                        })
                      }}>Feedback</button>
                    </form>
                  </div>
                </div>
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