import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import EditIcon from './EditIcon';
import DoneIcon from './DoneIcon';

import './styles.css';
import EntryBody from './Body';
import EditableEntryBody from './EditableBody';

class Entry extends Component {
  static propTypes = {
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    date: PropTypes.number.isRequired,
  };

  state = {
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam odio nisi, cursus et dignissim rhoncus, porttitor in metus. Sed congue semper elit a fringilla. Quisque vitae pulvinar elit. Praesent molestie urna id sem interdum, vel volutpat purus hendrerit. Duis semper vitae ligula a ultricies. Mauris aliquam rhoncus pellentesque. Nam at laoreet nisl. Pellentesque sagittis, mi ac mattis finibus, dolor lectus varius nulla, nec mollis leo eros non odio. Vestibulum maximus sed ex eu tempus. Fusce semper, metus et dignissim laoreet, felis magna tempor quam, at venenatis nisi libero et lorem. Nunc nec leo in ante porta accumsan vel vel ante. Ut pharetra nunc nec nibh pharetra dictum. Aenean tempor pulvinar sagittis. Curabitur maximus tellus vehicula mauris ullamcorper, vel laoreet turpis mattis. Nullam ut mollis turpis, at bibendum arcu. Aliquam et lectus tristique, lobortis massa a, malesuada erat. Nulla vitae sem magna. Praesent dolor enim, volutpat ut maximus nec, varius consequat dolor. Nam malesuada volutpat aliquet. Nunc a ante pellentesque, ornare tortor at, porta libero. Vestibulum ut mi at felis sagittis dignissim nec ac diam. Pellentesque egestas sagittis malesuada. Suspendisse porta mauris et nibh ultricies, et facilisis turpis ultrices. Quisque consequat orci velit, egestas tincidunt nunc viverra sed. Donec vitae est diam. Proin vitae enim leo. Duis mi diam, tincidunt eget massa in, vulputate efficitur erat.`,
    editing: false,
  };

  render() {
    const { year, month, date } = this.props;
    const { editing } = this.state;
    const icon = editing ? (
      <DoneIcon onClick={() => this.setState({ editing: false })} />
    ) : (
      <EditIcon onClick={() => this.setState({ editing: true })} />
    );

    const body = editing ? (
      <EditableEntryBody
        content={this.state.content}
        onChange={e => this.setState({ content: e.currentTarget.value })}
      />
    ) : (
      <EntryBody content={this.state.content} />
    );

    return (
      <div className="entry">
        <Header year={year} month={month} date={date} icon={icon} />
        {body}
      </div>
    );
  }
}

export default Entry;
