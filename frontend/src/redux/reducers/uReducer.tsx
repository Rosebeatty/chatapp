import { actionTypes } from "../actions/uActions";
import {StateType} from "typesafe-actions"

// CREATE THE REDUCER
const initialState: any = [];

const userReducer = ((state = initialState, action) => {
    switch(action.type) {
      case actionTypes.GET_USER:
        return [action.payload] 
      default:
        return state
    }
  });

  export type RootState = StateType<typeof userReducer>;

  export default userReducer
