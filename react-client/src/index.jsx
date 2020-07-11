import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
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
      test: 0
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
        <ReactModal isOpen={this.state.test === 2} onAfterOpen={this.getUserCount} style={{
          overlay: { zIndex: '20' },
          content: { backgroundColor: 'rgba(204, 204, 204, 0.8)' }
        }}>
          <span>
            <button className='btn btn-dark' onClick={() => {
              this.closeModal()
            }}>X</button> <p style={{float: 'right', fontSize: '1.5em'}}>There are currently <strong>{this.state.users}</strong> users signed up!</p>
          </span>
          <p>
            <strong>Introduction</strong><br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Hi there, Thank you for visiting my website! This modal only pops up for the recruiter account and gives a brief overview of how everything works. Don't feel like reading all this? Close the modal and try my site out! Search a fighter's name to see things work, I've already loaded a few of my favorites in for you. I included this for recruiters because as my app may seem simple from the outside, there is quite a lot going on behind the scenes. <br></br>
            <strong>What does this app do?</strong><br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Fight Watch is for keeping track of your favorite fighters, it will tell you when the date of their next fight is and who it is against. Originally I made this for myself as I could not keep track of every athlete I wanted to follow and missed some cruicial fights and then I fell in love with the project. <br></br>
            <strong>What technologies are used?</strong> <br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; For the frontend I'm using React, Bootstrap, CSS, Jquery, and HTML.<br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; On the backend I'm using Express, Express-session, AWS-SDK, bcrypt, Custom Google Search API, Cheerio, Fetch, Webpack and Sequelize with a MySQL database.<br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Fightwatch.me is registered with Route 53, the server is ran using EC2 with an Nginx reverse proxy routing traffic and the images are stored in an S3 bucket.<br></br>
            <strong>How does it work?</strong><br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; I'll do my best to keep this brief. When a user enters a fighter's name it hits my search endpoint. Eventually the fighter's data is scraped from an MMA website (Sherdog) but I have a series of optimizations inplace to try to avoid that if at all possible.<br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; My database is queried by the fighter's name to see if the information is already present. Each time a fighter is searched, if his information is not already present in the database then it is entered. If the fighter is present then he is simply joined to the user via a join table.<br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; If the fighter is not present then I use a custom google search with only Sherdog indexed. Using a custom Google search allows me to bypass having to interact with Sherdogs search feature programmatically; which proved troublesome in my original attempts. If google thinks there are any spelling errors in the fighter name I then query my database again to see if the fighter's name correctly spelled is present in my database. This may seem like an unnecessary step but it is actually optimal as scraping the web is quite a lengthy operation. This function is also helpful as it allows me to borrow Google's spellcheck for proper nouns algorithm istead of having to write my own. So may database searching has a defacto spellcheck built into it and Google is doing all the work for me :)<br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; If yet again the fighter is not present in my databse then I make another call to the custom search api this time with the corrected spelling. This returns a number of links (as Google does) and the first link will ALWAYS be a fighter profile. I then make a request to this link and scrape the needed data with Cheerio. During this process, the fighter's image is uploaded straight to an S3 bucket from Sherdog. Despite this being only one sentence, it was actually a HUGE optimization from the previous method (download image, upload to s3, delete image) and took quite a bit of research to figure out. <br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Now that the data has been retrieved it's entered into my "Fighters" table and is associated with the current user. Upon completing the request the component is rerendered and the new fighter is displayed. During the rendering process the fighters are sorted by the date of their next fight, first to last. I have a function running on an infinite loop that is invoked every 24 hours that goes through the list of all the fighters in my database and updates their information. Of course there is more going on, with using sessions to keep track of which account is logged in and how I query the join table and EC2 and so forth but going into detail about all that would be a mouthful that I'd prefer to save for the interview! Thank you again for visiting my site and I hope you like it!

          </p>
        </ReactModal>
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