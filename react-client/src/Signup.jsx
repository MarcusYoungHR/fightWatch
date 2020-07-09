import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import '../dist/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';


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
    })
  }

  submitHandler(endpoint) {
    var usernameRegex = /^[a-zA-Z0-9]+$/;

    if (this.state.username.length > 0 && this.state.password.length > 0 && this.state.username.match(usernameRegex) !== null) {
      $.ajax({
        url: endpoint,
        method: 'POST',
        data: this.state,
        success: (data)=> {
          console.log('it woiked')
          window.location.href = '/home'
        },
        error: (err)=> {
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
      <div>

        <div className='eyeShape'></div>

        <div className='mx-auto loginForm'>

          <h1 className='signUpHeader'>Login</h1>

          <form>

            <input className='loginInput' type='text' placeholder='user name' id='username' name='username' onChange={(event) => {
              this.changeHandler('username', event.target.value)
            }}>
            </input>

            <input className='loginInput' type='password' placeholder='password' id='password' name='password' onChange={(event) => {
              this.changeHandler('password', event.target.value)
            }}>
            </input>

            <button className="loginBtn btn btn-dark" onClick = {(event)=> {
              event.preventDefault()
              this.submitHandler('/login')
            }}> &nbsp;&nbsp;Login&nbsp;</button>

            <button className="btn btn-dark registerBtn" onClick ={(event)=> {
              event.preventDefault()
              this.submitHandler('/register')
            }}> Register </button>

          </form>
          <p className='loginText'>Don't have an account? Registering is easy! Simply choose a name and password and hit register. No email verification or password complexity required.</p>
        </div>

      </div>
    )
  }
}

ReactDOM.render(<Signup />, document.getElementById('app'));

export default Signup