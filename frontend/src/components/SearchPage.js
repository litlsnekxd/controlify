import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, Grid, Typography, Box } from '@material-ui/core';
import { Link } from "react-router-dom";

const RESULTS_PER_PAGE = 10;

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);

  const handleSearch = () => {
    fetch(`/spotify/search?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        setResults(data.tracks.items || []);
        console.log(data)
        setPage(0); // Reset to the first page on a new search
      });
  };

  const addToQueue = (uri) => {
    
    console.log(uri)


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
        "Content-Type": "application/json",
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ uri }),

    };

    fetch(`/spotify/queue/`, requestOptions)
    .then(response =>{
      if (response.ok) {
        alert('Song added to queue!');
      } else {
        alert('Failed to queue song')
      }

    })
    .catch(error => {
      console.error('Error adding song to queue: ', error);
      alert('An error occured');
    })
  }



  const handleNextPage = () => {
    if ((page + 1) * RESULTS_PER_PAGE < results.length) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const startIndex = page * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const paginatedResults = results.slice(startIndex, endIndex);

  return (
    <div>
      <Grid container spacing={2} direction="column">
        <Grid item xs={12}>
          <TextField
            label="Search for Songs"
            variant="outlined"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Grid>
        <Grid item xs={12} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <List>
            {paginatedResults.map((track) => (
              <ListItem key={track.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    src={track.album.images[0].url}
                    style={{ width: 60, height: 60 }} // Square image
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">{track.name}</Typography>}
                  secondary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">{track.artists.map(artist => artist.name).join(', ')}</Typography>
                      <Typography variant="body2">{Math.floor(track.duration_ms / 60000)}:{("0" + Math.floor((track.duration_ms % 60000) / 1000)).slice(-2)}</Typography>
                    </Box>
                  }
                />
                <Button variant="contained" color="secondary" onClick={()=> addToQueue(track.uri)}>
                  Add to Queue
                </Button>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <Button 
              variant="contained" 
              onClick={handlePreviousPage} 
              disabled={page === 0}
            >
              Previous
            </Button>
            <Button 
              variant="contained" 
              onClick={handleNextPage} 
              disabled={(page + 1) * RESULTS_PER_PAGE >= results.length}
            >
              Next
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="default"
            to="/"
            component={Link} // Navigate back to the room page
          >
            Back to Room
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SearchPage;
