import React, { Component } from "react";
import { Grid, Button, Typography} from "@material-ui/core";
import { Link} from 'react-router-dom';
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";


export default class Room extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      spotifyAuthenticated: false,
      song: {}
    };

    this.roomCode = this.props.match.params.roomCode;
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.authenticateSpotify = this.authenticateSpotify.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this)
    this.getRoomDetails();
  }

  componentDidMount(){
    this.interval = setInterval(this.getCurrentSong, 1000)
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  //GET ROOM DETAILS


  getRoomDetails(){
    return fetch('/api/get-room' + '?code=' + this.roomCode)
      .then((response) => { 

        if(!response.ok){
          this.props.leaveRoomCallback();
          this.props.history.push("/");
        }

        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
        if (this.state.isHost){
          this.authenticateSpotify()
        }
      });
  }


  //AUTHENTICATE SPOTIFY


  authenticateSpotify(){
    fetch('/spotify/is-authenticated')
    .then((response) => response.json())
    .then((data)=>{
      this.setState({spotifyAuthenticated: data.status});
      if (!data.status){
        fetch('/spotify/get-auth-url')
        .then((response)=>response.json())
        .then((data)=>{
          window.location.replace(data.url);
        })
      }
    });
  }


// GET CURRENT SONG


  getCurrentSong(){
    fetch('/spotify/current-song')
    .then((response) =>{
      if (!response.ok){
        return {};
      } else {
        return response.json();
      }
    })
    .then((data) => {
      this.setState({song: data});
      console.log(data);
    });
  }


  //HANDLE LEAVE BUTTON PRESS


  leaveButtonPressed(){
    
    var getCookie = function(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = cookies[i].trim();
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
    };
    
    var csrfToken = getCookie('csrftoken');

    const requestOptions = {
      method: "POST",
      headers: {
        'Content_Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    };
    fetch('/api/leave-room', requestOptions).then((_response)=> {
      this.props.leaveRoomCallback();
      this.props.history.push("/");
    });
  }


  //UPDATE IF SETTINGS ARE SHOWN


  updateShowSettings(value) {
    this.setState({
      showSettings:value,
    });
  }


  //RENDER SETTINGS PAGE


  renderSettings(){
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align='center'>
          <CreateRoomPage
            update={true}
            votesToSkip={this.state.votesToSkip}
            guestCanPause={this.state.guestCanPause}
            roomCode={this.roomCode}
            updateCallback={this.getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align='center'>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => this.updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    )
  }


  //RENDER SETTINGS BUTTON


  renderSettingsButton(){
    return(
      <Grid item xs={12} align ="center">
        <Button variant="contained" color="primary" onClick={()=>this.updateShowSettings(true)}>
          Settings
        </Button>
      </Grid>
    );
  }


  //RENDER


  render() {
    if(this.state.showSettings) {
      return this.renderSettings();
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align='center'>
          <Typography variant="h4" component="h4">
            Code: {this.roomCode}
          </Typography>
        </Grid>
        <MusicPlayer {...this.state.song}/>
        {this.state.isHost?this.renderSettingsButton():null}
        <Grid item xs={12} align='center'>
          <Button variant="contained" color="primary" component={Link} to="/search">
            Go to Search Page
          </Button>
        </Grid>
        <Grid item xs={12} align='center'>
          <Button variant="contained" color="secondary" onClick={this.leaveButtonPressed}>
            Leave the Room
          </Button>
        </Grid>
      </Grid>




    );
  }
}

/*
        <Grid item xs={12} align='center'>
          <Typography variant="h6" component="h4">
            Votes: {this.state.votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <Typography variant="h6" component="h4">
            Guest Can Pause: {this.state.guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <Typography variant="h6" component="h4">
            Host: {this.state.isHost.toString()}
          </Typography>
        </Grid>
  */