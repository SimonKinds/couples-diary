import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

const NAME_OF_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ending = number => {
  switch (number % 20) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

const withEnding = number => {
  return number + ending(number);
};

export const Entry = ({ year, month, date }) => (
  <div className="entry">
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      <Link to={`/calendar/${year}/${month}`} style={{ marginRight: '20px' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
          <path fill="none" d="M0 0h24v24H0z" />
        </svg>
      </Link>
      <h2
        style={{
          flex: 1,
          margin: 0,
        }}
      >
        {`${NAME_OF_MONTHS[month - 1]}`} {date}
        <sup>{ending(date)}</sup>
      </h2>
      <svg
        version="1.1"
        x="0px"
        y="0px"
        width="28px"
        height="28px"
        viewBox="0 0 24 24"
        enable-background="new 0 0 24 24"
      >
        <g id="Bounding_Boxes">
          <g id="ui_x5F_spec_x5F_header_copy_3" />
          <path fill="none" d="M0,0h24v24H0V0z" />
        </g>
        <g id="Outline_1_">
          <g id="ui_x5F_spec_x5F_header_copy_4" />
          <path
            id="XMLID_37_"
            d="M14.06,9.02l0.92,0.92L5.92,19H5v-0.92L14.06,9.02 M17.66,3c-0.25,0-0.51,0.1-0.7,0.29l-1.83,1.83
		l3.75,3.75l1.83-1.83c0.39-0.39,0.39-1.02,0-1.41l-2.34-2.34C18.17,3.09,17.92,3,17.66,3L17.66,3z M14.06,6.19L3,17.25V21h3.75
		L17.81,9.94L14.06,6.19L14.06,6.19z"
          />
        </g>
      </svg>
      <span
        style={{
          height: '22px',
          width: '22px',
          borderRadius: '50%',
          backgroundColor: 'purple',
          marginLeft: '15px',
        }}
      />
    </div>
    <div style={{ borderBottom: '1px solid', margin: '10px 0 20px' }} />

    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam odio nisi,
      cursus et dignissim rhoncus, porttitor in metus. Sed congue semper elit a
      fringilla. Quisque vitae pulvinar elit. Praesent molestie urna id sem
      interdum, vel volutpat purus hendrerit. Duis semper vitae ligula a
      ultricies. Mauris aliquam rhoncus pellentesque. Nam at laoreet nisl.
      Pellentesque sagittis, mi ac mattis finibus, dolor lectus varius nulla,
      nec mollis leo eros non odio. Vestibulum maximus sed ex eu tempus. Fusce
      semper, metus et dignissim laoreet, felis magna tempor quam, at venenatis
      nisi libero et lorem. Nunc nec leo in ante porta accumsan vel vel ante. Ut
      pharetra nunc nec nibh pharetra dictum. Aenean tempor pulvinar sagittis.
      Curabitur maximus tellus vehicula mauris ullamcorper, vel laoreet turpis
      mattis. Nullam ut mollis turpis, at bibendum arcu. Aliquam et lectus
      tristique, lobortis massa a, malesuada erat. Nulla vitae sem magna.
      Praesent dolor enim, volutpat ut maximus nec, varius consequat dolor. Nam
      malesuada volutpat aliquet. Nunc a ante pellentesque, ornare tortor at,
      porta libero. Vestibulum ut mi at felis sagittis dignissim nec ac diam.
      Pellentesque egestas sagittis malesuada. Suspendisse porta mauris et nibh
      ultricies, et facilisis turpis ultrices. Quisque consequat orci velit,
      egestas tincidunt nunc viverra sed. Donec vitae est diam. Proin vitae enim
      leo. Duis mi diam, tincidunt eget massa in, vulputate efficitur erat.{' '}
    </p>
  </div>
);

export default Entry;
