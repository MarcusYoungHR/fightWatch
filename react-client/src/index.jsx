import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import $ from 'jquery';
import List from './components/List.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

import ListBoxer from './components/ListBoxer.jsx'
import RecruiterModal from './components/RecruiterModal.jsx'
import FeedbackModal from './components/FeedbackModal.jsx'
import '../dist/styles.css'

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
      feedBack: false,
      dropDown: ''
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
    this.closeFeedBack = this.closeFeedBack.bind(this)
  }

  componentDidMount() {
    $.ajax({
      url: '/load',
      success: (data) => {
        data[0] = this.dateSorter(data[0])
        data[1] = this.dateSorter(data[1])
        //console.log('component did mount data: \n', data)

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
        //console.log('successfully submitted fighter', this.state, '\ndata\n', data)
        let tempArr = this.state.fighters.slice()
        tempArr.push(data)
        tempArr = this.dateSorter(tempArr)
        this.setState((prevState) => (
          {
            fighters: tempArr,
            fighter: ''
          }
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
        //console.log('successfully submitted boxer', data)
        let tempArr = this.state.boxers.slice()
        tempArr.push(data)
        tempArr = this.dateSorter(tempArr)
        this.setState((prevState) => (
          {
            boxers: tempArr,
            fighter: ''
          }
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

  removeHandler(name, endpoint, arr) {
    $.ajax({
      url: endpoint,
      method: 'DELETE',
      data: { fighter: name },
      success: () => {
        let index = this.state[arr].findIndex((elem)=> {
          //console.log(typeof elem.name)
          return elem.name == name
        })
        let tempArr = this.state[arr].slice()
        tempArr.splice(index, 1)
        this.setState({
          [arr]: tempArr
        })
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

  closeFeedBack() {
    this.setState({
      feedBack: false,
      message: ''
    })
  }

  getUserCount() {
    $.ajax({
      url: '/userCount',
      success: (data) => {
        //console.log('dkjsdakufba')
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
    if (this.state.message.length > 1000) {
      alert('Limit 1000 characters, shorten your message')
    } else {
      $.ajax({
        url: '/feedback',
        method: 'POST',
        data: { message: this.state.message },
        success: (data) => {
          this.setState({
            message: '',
            feedBack: false
          })
        }
      })
    }
  }

  render() {

    return (
      <div onClick = {()=> {
        if (this.state.dropDown == 'show') {
          this.setState({dropDown: ''})
        }
      }}>
        <RecruiterModal isOpen={this.state.test === 'pleaseGive'} onAfterOpen={this.getUserCount} users={this.state.users} closeModal={this.closeModal}></RecruiterModal>

        <FeedbackModal isOpen={this.state.feedBack} message={this.state.message} closeModal={this.closeFeedBack} changeHandler={this.messageHandler} submitHandler={this.feedbackSubmit}></FeedbackModal>

        <div className='container-fluid indexHeader' >
          <div className='row'>
            <div className='col'>

              <h1 className='fightHeader' >FIGHT &nbsp; WATCH</h1>
              <img src='https://dust0ohbmv3v2.cloudfront.net/logo2.png' className='indexLogo'></img>


            </div>

            <div className='col'>
              <div className='mx-auto headerInput' >
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="insert fighter name" value={this.state.fighter} aria-label="Recipient's username with two button addons" aria-describedby="button-addon4" onChange={(event) => {
                    this.onChange(event.target.value);
                  }}></input>
                  <div className="input-group-append" id="button-addon4">
                    <button className="btn btn-dark" type="button" onClick={(event) => {
                      event.preventDefault();
                      this.onSubmit()
                    }}>Search MMA</button>
                    <button className="btn btn-dark" type="button" onClick={(event) => {
                      event.preventDefault();
                      this.onBoxerSubmit()
                    }} disabled>Coming Soon!</button>
                  </div>
                </div>
              </div>
            </div>

            <div className='col'>
              <div className='class1' >
                <p className='loggedInAs'><strong>Currently logged in as {this.state.test} </strong></p>
                <div className="input-group" >
                  <div className="input-group-append" id="button-addon4" style={{ margin: '10px' }}>
                    <form action='/logout' method='post'>
                      <button className="btn btn-dark" type="submit">Log Out</button>
                      <button className="btn btn-dark" type="button" onClick={(event) => {
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

        <div className="container-fluid">
          <div className='row'>
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={() => {
                if (this.state.dropDown == 'show') {
                  this.setState({ dropDown: '' })
                } else {
                  this.setState({ dropDown: 'show' })
                }
              }}>
                Sort by
              </button>
              <div className={`dropdown-menu ${this.state.dropDown}`} aria-labelledby="dropdownMenuButton">
                <button className="dropdown-item btn btn-light" href="#" onClick={() => {
                  let boxArr = this.state.boxers.slice()
                  let fightArr = this.state.fighters.slice()
                  boxArr = this.dateSorter(boxArr)
                  fightArr = this.dateSorter(fightArr)
                  this.setState({
                    dropDown: '',
                    fighters: fightArr,
                    boxers: boxArr
                  })
                }}>Next fight</button>
                <button className="dropdown-item btn btn-light" href="#" onClick={() => {
                  let boxArr = this.state.boxers.slice()
                  let fightArr = this.state.fighters.slice()
                  boxArr.sort()
                  fightArr = fightArr.sort((a, b)=> {
                    if(a.name < b.name) { return -1; }
                    if(a.name > b.name) { return 1; }
                    return 0;
                  })
                  console.log(fightArr)
                  this.setState({
                    dropDown: '',
                    fighters: fightArr,
                    boxers: boxArr
                  }, ()=>{/*console.log(this.state.fighters)*/})
                }}>Alphabetical</button>
              </div>
            </div>
          </div>
          <div className="row">
            <List items={this.state.fighters} removeHandler={this.removeHandler}></List>
          </div>

          <div className="row">
            <ListBoxer items={this.state.boxers} removeHandler={this.removeHandler}></ListBoxer>
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