import * as actionTypes from './actions';

const initialState = {
  tableId: null,
  players: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_PLAYER:
      const playersArray = state.players;

      playersArray.push(action.player);
      return {
        ...state,
        players: playersArray
      };
    case actionTypes.CREATE_TABLE:
      return {
        ...state,
        tableId: action.tableId
      };
    case actionTypes.UPDATE_PLAYER:
      return {
        ...state,
        players: action.players
      };
    case actionTypes.REMOVE_PLAYER:
      return {

      };
    default:
      return state;
  }
};

export default reducer;