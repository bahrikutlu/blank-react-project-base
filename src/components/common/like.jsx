import React, {Component} from 'react';

// input: liked: boolean
// output: onClick

class Like extends Component {
    render() {
        let classes = "fa fa-heart"
        if (!this.props.liked) classes += "-o"

        return (
            <i onClick={this.props.likeToggle}
               style={{cursor:'pointer'}}
               className={classes}
               aria-hidden="true"/> // or onLikeToggle name does not matter
        );
    }
}

export default Like;
