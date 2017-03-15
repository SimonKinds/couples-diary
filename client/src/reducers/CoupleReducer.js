import { GET_COUPLE_SUCCESS } from '../actions/CoupleActions';

function couple(state = {}, action) {
  switch (action.type) {
    case GET_COUPLE_SUCCESS:
      const couple = action.couple;
      return {
        id: couple.id,
        thisUser: couple.thisUser.id,
        otherUser: couple.otherUser.id
      };
    default:
      return state;
  }
}

export default couple;
