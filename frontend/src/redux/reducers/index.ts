
import { combineReducers } from 'redux'
import userReducer from './userReducer'
import uReducer from './uReducer'
import chatReducer from './chatReducer'
import downloadReducer from './downloadReducer'
import {StateType} from "typesafe-actions"


export const rootReducer = combineReducers({
    user: userReducer,
    usr: uReducer,
    chat: chatReducer,
    download: downloadReducer
  })

export type RootState = StateType<typeof rootReducer>;
