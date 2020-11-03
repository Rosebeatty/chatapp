import { actionTypes, RootAction } from "../actions/chatActions";

// CREATE THE CHAT REDUCER
const initialState: any = [];

const chatReducer = ((state = initialState, action: RootAction) => {
  switch(action.type) {
    case actionTypes.ADD_NEW_MESSAGE:
      return [...state, action.payload]
    case actionTypes.DELETE_MESSAGES:
      return initialState
    default:
      return state
  }
});

export default chatReducer;