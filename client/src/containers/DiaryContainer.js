import { connect } from 'react-redux';

import Diary from '../components/Diary';

function mapStateToProps(state) {
  return {
    year: state.diary.ui.selectedYear
  }
}

export default connect(mapStateToProps)(Diary);
