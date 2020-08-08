import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../dist/styles.css'
import SignupModal from './components/SignupModal.jsx'


class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      modal: false
    }
    this.changeHandler = this.changeHandler.bind(this)
    this.submitHandler = this.submitHandler.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  changeHandler(entry, val) {
    this.setState({
      [entry]: val
    })
  }

  closeModal() {
    this.setState({
      modal: false,
      username: '',
      password: ''
    })
  }

  submitHandler(endpoint) {
    var usernameRegex = /^[a-zA-Z0-9]+$/;

    if (this.state.username.length > 0 && this.state.password.length > 0 && this.state.username.match(usernameRegex) !== null) {
      $.ajax({
        url: endpoint,
        method: 'POST',
        data: this.state,
        success: (data) => {
          //console.log('it woiked')
          window.location.href = '/home'
        },
        error: (err) => {
          console.log('oh no \n', err)
          if (err.status === 403) {
            alert(err.responseText)
          } else if (err.status === 400) {
            alert('user already exists')
          }
        }
      })
    } else {
      alert('please enter valid username and password')
    }
  }

  render() {

    return (
      <div className='mx-auto my-auto w-50' style={{ backgroundColor: 'rgb(138, 3, 3)' }}>

        <SignupModal isOpen={this.state.modal} closeModal={this.closeModal} changeHandler={this.changeHandler} submitHandler={this.submitHandler}></SignupModal>

        <h1 className='signUpHeader'>Fight Watch</h1>

        <img className='mx-auto w-25' src='https://dust0ohbmv3v2.cloudfront.net/logo2.png' style={{ display: 'block' }}></img>

        {/* <form>

            <input className='loginInput' type='text' value={this.state.username} placeholder='username' id='username' name='username' onChange={(event) => {
              this.changeHandler('username', event.target.value)
            }}>
            </input>

            <input className='loginInput' type='password' value={this.state.password} placeholder='password' id='password' name='password' onChange={(event) => {
              this.changeHandler('password', event.target.value)
            }}>
            </input>

            <button className="loginBtn btn btn-dark" onClick = {(event)=> {
              event.preventDefault()
              this.submitHandler('/login')
            }}> &nbsp;&nbsp;Login&nbsp;</button>

            <button className="btn btn-dark registerBtn" onClick ={(event)=> {
              event.preventDefault()
              // this.submitHandler('/register')
              this.setState({
                modal: true
              })
            }}> Sign Up </button>

          </form> */}

        <form className='mx-3'>
          <div class="form-group">
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder='username' onChange={(event) => {
              this.changeHandler('username', event.target.value)
            }}></input>
          </div>
          <div class="form-group">
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder='password' onChange={(event) => {
              this.changeHandler('password', event.target.value)
            }}></input>
          </div>
          <button type="submit" class="btn btn-dark" onClick = {(event)=> {
              event.preventDefault()
              this.submitHandler('/login')
            }}>Login</button>
          <button type="submit" class="btn btn-dark" style={{float: 'right'}} onClick ={(event)=> {
              event.preventDefault()
              // this.submitHandler('/register')
              this.setState({
                modal: true
              })
            }}>Sign Up</button>
        </form>

        <p className='loginText'>Don't have an account? Registering is easy! Simply choose a name and password. No email verification or password complexity required.</p>


      </div>
    )
  }
}

ReactDOM.render(<Signup />, document.getElementById('app'));

export default Signup