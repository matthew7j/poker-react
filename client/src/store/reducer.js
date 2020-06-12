import * as actionTypes from './actions';

const initialState = {
  players: [],
  table: {},
  player: {}
};

const reducer = (state = initialState, action) => {
  let currentPlayersArray;

  switch (action.type) {
    case actionTypes.ADD_PLAYER:
      const playersArray = state.players;
      playersArray.concat(action.player);

      return {
        ...state,
        players: [...playersArray],
        player: action.player
      };
    case actionTypes.CREATE_TABLE:
      return {
        ...state,
        table: action.table
      };
    case actionTypes.UPDATE_PLAYERS:
      return {
        ...state,
        players: [...action.players]
      };
    case actionTypes.ADD_TABLE_TO_REDUX:
      return {
        ...state,
        table: action.table
      };
    case actionTypes.JOIN_TABLE:
      return {
        ...state,
        table: action.table
      }
    case actionTypes.LEAVE_TABLE:
      return {
        ...state,
        tableId: action.tableId
      }
    case actionTypes.ADD_NEW_PLAYER:
      return {
        ...state,
        player: Object.assign({}, action.player)
      };
    case actionTypes.NEW_PLAYER:
      currentPlayersArray = [...state.players];

      currentPlayersArray.push(action.player);
      return {
        ...state,
        players: [...currentPlayersArray]
      };
    case actionTypes.REMOVE_PLAYER:
      return {

      };
    case actionTypes.CLEAR_REDUX:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default reducer;