import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';



class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      method: '/signup'
    }
    this.changeHandler = this.changeHandler.bind(this)
    this.submitHandler = this.submitHandler.bind(this)

    this.eyeShape = {
      margin: '0 auto',
      width: '160px',
      height: '160px',
      backgroundImage: "url(images/Untitled.png)",
      borderRadius: '100% 0px',
      transform: 'rotate(45deg)'
    }
  }

  changeHandler(entry, val) {
    this.setState({
      [entry]: val
    })
  }

  submitHandler(method) {
    this.setState({
      method: method
    }, () => {
      console.log(this.state.method)
      // $.ajax({
      //   url: this.state.method,
      //   type: 'POST',
      //   data: {user: this.state},
      //   success: () => {
      //     console.log('yay')
      //   },
      //   error: (err) => {
      //     console.log('error in signup \n', err)
      //   }
      // })
    })
  }



  render() {

    return (
      <div>
        <div style ={this.eyeShape}></div>

        <h1 style = {{display: 'block', margin: 'auto', width: '300px', backgroundColor: 'white', borderStyle: 'solid', borderWidth: '7px 7px 0px 7px', marginTop: '21%', textAlign: 'center', paddingBottom: '20px'}}>Login</h1>
        <div class='mx-auto' style={{ width: '300px', backgroundColor: 'white', borderStyle: 'solid', borderWidth: '0px 7px 7px 7px', marginTop: '-7px', position: 'relative'}}>
          <form>
            <input type='text' placeholder='user name' style={{ width: '286px', position: 'relative' }} onChange={(event) => {
              this.changeHandler('username', event.target.value)
            }}>
            </input>
            <input type='text' placeholder='password' style={{ width: '286px', position: 'relative' }} onChange={(event) => {
              this.changeHandler('password', event.target.value)
            }}>
            </input>
            <button className="btn btn-outline-secondary" style={{borderRadius: '0px', position: 'relative'}} onClick={(event) => {
              event.preventDefault()
              this.submitHandler('/signup');
            }}> Login </button>
            <button className="btn btn-outline-secondary" style={{borderRadius: '0px', float: 'right' }} onClick={(event) => {
              event.preventDefault()
              this.submitHandler('/register');
            }}> Register </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Signup