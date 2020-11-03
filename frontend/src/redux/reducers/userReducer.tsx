import { actionTypes } from "../actions/userActions";
import {StateType} from "typesafe-actions"

// CREATE THE REDUCER
const initialState: any = [];

const userReducer = ((state = initialState, action) => {
    switch(action.type) {
      case actionTypes.GET_USERS:
        return [...state, action.payload]
      default:
        return state
    }
  });

  export type RootState = StateType<typeof userReducer>;

  export default userReducer
