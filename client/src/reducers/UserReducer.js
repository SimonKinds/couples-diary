import { GET_COUPLE_SUCCESS } from '../actions/CoupleActions';

function users(state = {}, action) {
  switch (action.type) {
    case GET_COUPLE_SUCCESS:
      const couple = action.couple;
      let users = {};
      users[couple.thisUser.id] = couple.thisUser;
      users[couple.otherUser.id] = couple.otherUser;
      return users;
    default:
      return state;
  }
}

export default users;
