import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
    this.changeHandler = this.changeHandler.bind(this)
    this.submitHandler = this.submitHandler.bind(this)
  }

  changeHandler(entry, val) {
    this.setState({
      [entry]: val
    }, () => {console.log(this.state)})
  }

  submitHandler() {
    $.ajax({
      url: '/signup',
      type: 'POST',
      data: {user: this.state},
      success: () => {
        console.log('yay')
      },
      error: (err) => {
        console.log('error in signup \n', err)
      }
    })
  }

  render() {
    return (
      <div>
        <form>
          <input type='text' placeholder='user name' onChange={(event) => {
            this.changeHandler('username', event.target.value)
          }}>
          </input>
          <input type='text' placeholder='password' onChange={(event) => {
            this.changeHandler('password', event.target.value)
          }}>
          </input>
          <button onClick={(event) => {
            event.preventDefault()
            this.submitHandler();
          }}>
            Sign Up
          </button>
        </form>
      </div>
    )
  }
}

export default Signup