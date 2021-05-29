import { actionTypes, RootAction } from "../actions/chatActions";
import {StateType} from "typesafe-actions"

// CREATE THE CHAT REDUCER
const initialState: any = [];

const chatReducer = ((state = initialState, action: RootAction) => {
  switch(action.type) {
    // case actionTypes.SAVE_MESSAGE:
    //   return [...state, action.payload]
    case actionTypes.ADD_MESSAGE:
      return [...state, action.payload]
    case actionTypes.DELETE_MESSAGES:
      return initialState
    default:
      return state
  }
});

export type RootState = StateType<typeof chatReducer>;

export default chatReducer;