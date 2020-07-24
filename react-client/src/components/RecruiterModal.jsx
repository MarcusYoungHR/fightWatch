import React from 'react';
import ReactModal from 'react-modal';


const RecruiterModal = (props) => (
  <ReactModal /*isOpen={this.state.test === 2} onAfterOpen={this.getUserCount}*/ isOpen={props.isOpen} onAfterOpen={props.onAfterOpen} style={{
    overlay: { zIndex: '20' },
    content: { backgroundColor: 'rgba(29, 22, 22, 0.8)', color: 'rgb(230, 230, 230)' }
  }}>
    <span>
      <button className='btn btn-danger test' onClick={() => {
        props.closeModal()
      }}>X</button> <p style={{ float: 'right', fontSize: '1.5em' }}>There are currently <strong>{props.users}</strong> users signed up!</p>
    </span>
    <p>
      <strong>Introduction</strong><br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Hi there, Thank you for visiting my website! This modal only pops up for the recruiter account and gives a brief overview of how everything works. Don't feel like reading all this? Close the modal and try my site out! Search a fighter's name to see things work, I've already loaded a few of my favorites in for you. I included this for recruiters because although my app may seem simple from the outside, there is quite a lot going on behind the scenes. <br></br>
      <strong>What does this app do?</strong><br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Fight Watch is for keeping track of your favorite fighters, it will tell you when the date of their next fight is and who it is against. Originally I made this for myself as I could not keep track of every athlete I wanted to follow and missed some cruicial fights and then I fell in love with the project. <br></br>
      <strong>What technologies are used?</strong> <br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; For the frontend I'm using React, Bootstrap, CSS, Jquery, and HTML.<br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; On the backend I'm using Express, Express-session, AWS-SDK, bcrypt, Custom Google Search API, Cheerio, Fetch, Webpack and Sequelize with a MySQL database.<br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Fightwatch.me is registered with Route 53, the server is ran using EC2 with an Nginx reverse proxy routing traffic and the images and bundles are stored in an S3 bucket which are served and compressed via cloudfront.<br></br>
      <strong>How does it work?</strong><br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; I'll do my best to keep this brief. When a user enters a fighter's name it hits my search endpoint. Eventually the fighter's data is scraped from an MMA website (Sherdog) but I have a series of optimizations inplace to try to avoid that if at all possible.<br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; My database is queried by the fighter's name to see if the information is already present. Each time a fighter is searched, if his information is not already present in the database then it is entered. If the fighter is present then he is simply joined to the user via a join table.<br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; If the fighter is not present then I use a custom google search with only Sherdog indexed. Using a custom Google search allows me to bypass having to interact with Sherdogs search feature programmatically; which proved troublesome in my original attempts. If google thinks there are any spelling errors in the fighter name I then query my database again to see if the fighter's name correctly spelled is present in my database. This may seem like an unnecessary step but it is actually optimal as scraping the web is quite a lengthy operation. This function is also helpful as it allows me to borrow Google's spellcheck for proper nouns algorithm istead of having to write my own. So may database searching has a defacto spellcheck built into it and Google is doing all the work for me :)<br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; If yet again the fighter is not present in my databse then I make another call to the custom search api this time with the corrected spelling. This returns a number of links (as Google does) and the first link will ALWAYS be a fighter profile. I then make a request to this link and scrape the needed data with Cheerio. During this process, the fighter's image is uploaded straight to an S3 bucket from Sherdog. Despite this being only one sentence, it was actually a HUGE optimization from the previous method (download image, upload to s3, delete image) and took quite a bit of research to figure out. <br></br>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Now that the data has been retrieved it's entered into my "Fighters" table and is associated with the current user. Upon completing the request the component is rerendered and the new fighter is displayed. During the rendering process the fighters are sorted by the date of their next fight, first to last. I have a function running on an infinite loop that is invoked every 24 hours that goes through the list of all the fighters in my database and updates their information. Of course there is more going on, with using sessions to keep track of which account is logged in and how I query the join table and EC2 and so forth but going into detail about all that would be a mouthful that I'd prefer to save for the interview! Thank you again for visiting my site and I hope you like it!
          </p>
  </ReactModal>
)

export default RecruiterModal