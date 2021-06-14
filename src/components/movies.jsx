import React, {Component} from "react";
import {getMovies} from "../services/fakeMovieService";
import Pagination from "./common/pagination";
import {paginate} from "../utils/paginate";
import ListGroup from "./common/listGroup";
import {getGenres} from "../services/fakeGenreService";
import MoviesTable from "./moviesTable";
import _ from 'lodash'

class Movies extends Component {
    state = {
        allMovies: [],
        pageSize: 4,
        currentPage: 1,
        genres: [],
        selectedGenre:"",
        sortColumn: {path:'title', order:'ascending'}

    }
    handleGenreSelect = (genre) => {
        this.setState({selectedGenre: genre, currentPage: 1})
    };
    handleSort = sortColumn => {
        this.setState({sortColumn})
    };


    componentDidMount() {
        const genres = [{name:'All Genres', _id:-1}, ...getGenres()]
        this.setState({allMovies: getMovies(), genres: genres})
    }

    handleDelete = movie => {
        const movies = this.state.allMovies.filter(m => m._id !== movie._id)
        this.setState({allMovies: movies})
    }
    handleLike = movie=>{
        const allMovies = [...this.state.allMovies]
        const index = allMovies.indexOf(movie)
        allMovies[index] = {...allMovies[index]}
        allMovies[index].liked = !allMovies[index].liked
        this.setState({allMovies})
    };
    handlePageChange = page=>{
        this.setState({currentPage: page})
    };

    getPagedData =() => {
        const {pageSize, currentPage, allMovies, selectedGenre, sortColumn} = this.state

        const filtered = selectedGenre && selectedGenre._id !== -1
            ? allMovies.filter(m=>m.genre._id===selectedGenre._id)
            : allMovies
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        const movies = paginate(sorted, currentPage, pageSize)
        return {totalCount: filtered.length, data: movies}
    }
    render() {
        const {length: count} = this.state.allMovies
        const {pageSize, currentPage, selectedGenre, sortColumn} = this.state

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

