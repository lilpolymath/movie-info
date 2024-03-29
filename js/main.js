$(document).ready(() => {
  $('#searchForm').on('submit', e => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });

  $('#newSearch').on('submit', e => {
    e.preventDefault();
    let SearchText = $('#newSearchText').val();
    window.location = `index.html?newText=${SearchText}`;
  });

  const passUrlToSearch = () => {
    var newSearchText = getUrlVars()['newText'];
    if (newSearchText) {
      $('#searchText').val(newSearchText);
      getMovies(newSearchText);
    }
  };
  passUrlToSearch();
});

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf('?') + 1)
    .split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

function getMovies(searchText) {
  axios
    .get('https://www.omdbapi.com?s=' + searchText + '&apikey=6d6a2625')
    .then(response => {
      let movies = response.data.Search;
      let output = '';
      $.each(movies, (index, movie) => {
        output += `
          <div class='col-md-3'>
          <div class ='well text-center'>
              <img src='${movie.Poster}'>
                  <h5>${movie.Title}</h5>
                  <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
          </div>
          </div>
        `;
      });
      $('#movies').html(output);
    })
    .catch(err => {
      console.log(err);
    });
}

// handles the selected movie
function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  window.location = './movie.html';
  return false;
}

function getMovie() {
  let movieID = sessionStorage.getItem('movieId');
  axios
    .get('https://www.omdbapi.com?i=' + movieID + '&apikey=6d6a2625')
    .then(response => {
      let movie = response.data;
      let output = `<div class="row">
          <div class="col-md-4">
          <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
          <h3>${movie.Title}</h3>
          <ul class="list group">
          <li class="list-group-item"><strong>Genre: </strong>${movie.Genre}</li>
          <li class="list-group-item"><strong>Released: </strong>${movie.Released}</li>
          <li class="list-group-item"><strong>Rated: </strong>${movie.Rated}</li>
          <li class="list-group-item"><strong>IMDB Rating: </strong>${movie.IMDBRating}</li>
          <li class="list-group-item"><strong>Director: </strong>${movie.Director}</li>
          <li class="list-group-item"><strong>Writer: </strong>${movie.Writer}</li>
          <li class="list-group-item"><strong>Actor: </strong>${movie.Actor}</li>
          </ul>
          </div>
          </div>
          <div class="row">
          <div class="col-md-12">
          <hr/>
          <h3> Plot</h3>
          ${movie.Plot}
          <hr>
          <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">Check More Details</a>
          </div></div>`;
      $('#movie').html(output);
    })
    .catch(err => {
      console.log(err);
    });
}
