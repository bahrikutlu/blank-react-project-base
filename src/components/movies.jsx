import React, {Component} from "react";
import {getMovies, deleteMovie, likeMovie} from "../services/fakeMovieService";
import Pagination from "./common/pagination";
import {paginate} from "../utils/paginate";
import ListGroup from "./common/listGroup";
import {getGenres} from "../services/fakeGenreService";
import MoviesTable from "./moviesTable";
import _ from 'lodash'
import { Link } from "react-router-dom";
import SearchBox from "./searchBox";


class Movies extends Component {
    state = {
        allMovies: [],
        pageSize: 4,
        currentPage: 1,
        genres: [],
        selectedGenre:"",
        sortColumn: {path:'title', order:'ascending'},
    searchQuery: "",

    }
    handleGenreSelect = (genre) => {
        this.setState({selectedGenre: genre, currentPage: 1, searchQuery: ""})
    };
    handleSort = sortColumn => {
        this.setState({sortColumn})
    };

    componentDidMount() {
        // const genres = [{name:'All Genres', _id:-1}, ...getGenres()]
        const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
        this.setState({allMovies: getMovies(), genres: genres})
    }

    handleDelete = movie => {
        const movies = this.state.allMovies.filter(m => m._id !== movie._id)
        this.setState({allMovies: movies})
        deleteMovie(movie._id);
    }
    handleLike = movie=>{
        const allMovies = [...this.state.allMovies]
        const index = allMovies.indexOf(movie)
        allMovies[index] = {...allMovies[index]}
        allMovies[index].liked = !allMovies[index].liked
        likeMovie(movie)
        this.setState({allMovies})
    };
    handlePageChange = page=>{
        this.setState({currentPage: page})
    };

    handleSearch = query => {
        this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
    };

    getPagedData =() => {
        const {pageSize, currentPage, allMovies, selectedGenre, sortColumn, searchQuery,} = this.state

        let filtered = allMovies;
        if (searchQuery)
          filtered = allMovies.filter(m =>
            m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
          );
        else if (selectedGenre && selectedGenre._id)
          filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);

        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

        const movies = paginate(sorted, currentPage, pageSize);

        return { totalCount: filtered.length, data: movies };
      };

    render() {
        const {length: count} = this.state.allMovies
        const {pageSize, currentPage, selectedGenre, sortColumn, searchQuery } = this.state

        if (count === 0) return <p>There are no movies in the database</p>

        const {totalCount, data:movies} = this.getPagedData()

        return (
            <div className='row'>
                <div className="col-3">
                    <ListGroup
                        items={this.state.genres}
                        selectedItem={selectedGenre}
                        onItemSelect={this.handleGenreSelect}
                    />
                </div>
                <div className="col">
                    <Link to="/movies/new" className="btn btn-primary" style={{ marginBottom: 20 }}>New Movie</Link>
                    <SearchBox value={searchQuery} onChange={this.handleSearch} />
                    <p>Showing {totalCount} movies in the database</p>
                    <MoviesTable
                        movies={movies}
                        sortColumn={sortColumn}
                        onDelete={this.handleDelete}
                        onLike={this.handleLike}
                        onSort={this.handleSort}
                    />
                    <Pagination
                        itemsCount={totalCount}
                        currentPage ={currentPage}
                        pageSize={pageSize}
                        onPageChange={this.handlePageChange}
                    />
                </div>

            </div>
        )
    }

}

export default Movies

