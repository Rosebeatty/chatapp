import { actionTypes, RootAction } from "../actions/actions";
import {StateType} from "typesafe-actions"

// CREATE THE REDUCER
const initialState = [];

export const chatReducer = ((state = initialState, action: RootAction) => {
  switch(action.type) {
    case actionTypes.ADD_NEW_MESSAGE:
      return [...state, action.payload]
    default:
      return state
  }
});

export type RootState = StateType<typeof chatReducer>;

export default chatReducer;