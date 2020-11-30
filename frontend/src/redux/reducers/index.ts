
import { combineReducers } from 'redux'
import userReducer from './userReducer'
import chatReducer from './chatReducer'
import downloadReducer from './downloadReducer'
import {StateType} from "typesafe-actions"


export const rootReducer = combineReducers({
    user: userReducer,
    chat: chatReducer,
    download: downloadReducer
  })

export type RootState = StateType<typeof rootReducer>;
