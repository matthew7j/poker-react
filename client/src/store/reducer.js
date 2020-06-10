import * as actionTypes from './actions';

const initialState = {
  tableId: null,
  players: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_PLAYER:
      console.log('in reducer');
      const playersArray = state.players;

      playersArray.push(action.player);
      return {
        ...state,
        players: playersArray
      };
    case actionTypes.REMOVE_PLAYER:
      return {

      };
    default:
      return state;
  }
};

export default reducer;