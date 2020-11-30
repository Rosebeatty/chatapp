import { actionTypes } from "../actions/downloadActions";
import {StateType} from "typesafe-actions"

// CREATE THE REDUCER
const initialState: any = [];

const downloadReducer = ((state = initialState, action) => {
    switch(action.type) {
      case actionTypes.DOWNLOAD_FILE:
        return [...state, action.payload]
      default:
        return state
    }
  });

  export type RootState = StateType<typeof downloadReducer>;

  export default downloadReducer
