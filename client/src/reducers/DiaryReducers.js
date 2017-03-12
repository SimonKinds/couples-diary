import { GET_COUPLE_SUCCESS } from '../actions/CoupleActions';

function diary(state = {}, action) {
  switch (action.type) {
    case GET_COUPLE_SUCCESS:
      return {
        ...state,
        users: users(action.couple),
        couple: couple(action.couple)
      };
    default:
      return state;
  }
}

function users(couple) {
  let users = {};
  users[couple.thisUser.id] = coule.thisUser;
  users[couple.otherUser.id] = coule.otherUser;
  return users;
}

function couple(couple) {
  return {
    id: couple.id,
    thisUser: couple.thisUser.id,
    otherUser: couple.otherUser.id
  };
}
