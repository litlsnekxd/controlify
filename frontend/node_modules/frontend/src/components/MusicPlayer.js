import React, {Component} from 'react';
import {
    Grid,
    Typography,
    Card,
    IconButton,
    LinearProgress,
} from '@material-ui/core';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';

export default class MusicPlayer extends Component{
    constructor(props){
        super(props);
    }


    skipSong(){
        
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
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }
        };
        fetch('/spotify/skip', requestOptions);
    }



    pauseSong(){

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
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }
        };
        fetch('/spotify/pause', requestOptions)
    }

    playSong(){
        
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
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            }
        };
        fetch('/spotify/play', requestOptions)
    }




    render(){

        const songProgress = (this.props.time / this.props.duration) * 100

        return (<Card>
            <Grid container alignItems='center'>
                <Grid item align='center' xs={4}>
                    <img src={this.props.image_url} height='100%' width='100%'/>
                </Grid>
                <Grid item align='center' xs={8}>
                    <Typography component='h5' variant='h5'>
                        {this.props.title}
                    </Typography>
                    <Typography color='textSecondary' variant='subtitle1'>
                        {this.props.artist}
                    </Typography>
                    <div>
                        <IconButton
                            onClick={() => {
                                this.props.is_playing ? this.pauseSong() : this.playSong();
                            }}
                        >
                            {this.props.is_playing ? <PauseIcon/> : <PlayArrowIcon/>}
                        </IconButton>
                        <IconButton onClick={ () => this.skipSong()}>
                            <SkipNextIcon/> {this.props.votes} / {this.props.votes_required}
                        </IconButton>
                    </div>                      
                </Grid>
            </Grid>
            <LinearProgress variant='determinate' value = {songProgress} />
        </Card>);
    }
}