
import { combineReducers } from 'redux'
import userReducer from './userReducer'
import chatReducer from './chatReducer'
import {StateType} from "typesafe-actions"


export const rootReducer = combineReducers({
    user: userReducer,
    chat: chatReducer
  })

export type RootState = StateType<typeof rootReducer>;
