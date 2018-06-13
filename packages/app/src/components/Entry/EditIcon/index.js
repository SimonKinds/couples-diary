import React from 'react';
import PropTypes from 'prop-types';

export const EditIcon = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    x="0px"
    y="0px"
    width="28px"
    height="28px"
    viewBox="0 0 24 24"
    enableBackground="new 0 0 24 24"
    onClick={props.onClick}
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
);

EditIcon.propTypes = {
  onClick: PropTypes.func,
};

export default EditIcon;
