import React, { Component } from 'react';

import './styles.css';

class EditableEntryBody extends Component {
  state = { height: 0 };

  setTextArea = e => {
    this.textArea = e;
    this.updateHeight();
  };

  updateHeight = () => {
    if (this.textArea) {
      const height = parseInt(this.textArea.scrollHeight, 10);
      if (height !== this.state.height) {
        this.setState({ height });
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.content !== this.props.content) {
      this.updateHeight();
    }
  }

  render() {
    return (
      <textarea
        ref={this.setTextArea}
        className="entry-body"
        style={{ height: `${this.state.height}px` }}
        value={this.props.content}
        onChange={this.props.onChange}
      />
    );
  }
}

export default EditableEntryBody;
