import React from "react";
import BookmarksContext from "../BookmarksContext";
import config from "../config";

export default class EditBookmark extends React.Component {
  static contextType = BookmarksContext;

  state = {
    id: "",
    title: "",
    url: "",
    description: "",
    rating: 1,
  };

  componentDidMount() {
    const { bookmarkId } = this.props.match.params;

    fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`, {
      method: "GET",
      headers: {
        'authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(res.statusText);
      })
      .then(resJson => {
        this.setState({
          id: resJson.id,
          title: resJson.title,
          url: resJson.url,
          description: resJson.description,
          rating: resJson.rating
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleChangeTitle = e => {
    this.setState({
      title: e.target.value
    })
  };

  handleUrlChange = e => {
    this.setState({
      url: e.target.value
    })
  };

  handleDescriptionChange = e => {
    this.setState({
      description: e.target.value
    })
  };

  handleRatingChange = e => {
    this.setState({
      rating: e.target.value
    })
  };

  handleSubmit = e => {
    e.preventDefault();
    const { bookmarkId } = this.props.match.params

    const {id, title, url, description, rating} = this.state

    const newBookmark = {
      id,
      title,
      url,
      description,
      rating,
    };

    fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`,

      {
        method: "PATCH",
        body: JSON.stringify(newBookmark),
        headers: {
          "content-type": "application/json",
          'authorization': `Bearer ${config.API_KEY}`
        }
      })
      .then(res => {
        if (!res.ok) {
         throw new Error(res.statusText);
        }
      })
      .then(() => {
        this.context.updateBookmark(newBookmark);
        this.props.history.push("/");
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { title, url, description, rating } = this.state;

    return (
      <section className="EditBookmarkForm">
        <h2>Edit Bookmark</h2>
        <form onSubmit={this.handleSubmit}>

          <div>
            <label htmlFor="Title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Great Bookmark!"
              required
              value={title}
              onChange={this.handleChangeTitle}
            />
          </div>

          <div>
            <label htmlFor="url">URL</label>
            <input
              id="url"
              type="url"
              placeholder="https://www.google.com"
              required
              value={url}
              onChange={this.handleUrlChange}
            />
          </div>

          <div>
          <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              placeholder="Great Description!"
              required
              value={description}
              onChange={this.handleDescriptionChange}
            />
          </div>

          <div>
          <label htmlFor="rating">Rating</label>
            <input
              id="rating"
              type="number"
              required
              min="1"
              max="5"
              value={rating}
              onChange={this.handleRatingChange}
            />
          </div>
          <button type='submit'>Submit</button>
        </form>
      </section>
    );
  }
}
