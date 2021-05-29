// import { ADD_NEW_MESSAGE } from '../types/types';
import { action, ActionType } from "typesafe-actions";
import axios from 'axios'

export enum actionTypes {
  ADD_MESSAGE = "ADD_MESSAGE",
  DELETE_MESSAGES = "DELETE_MESSAGES",
  GET_USERS = "GET_USERS",
  USERS_ERROR = "USERS_ERROR",
  GET_USER = "GET_USER",
  DOWNLOAD_FILE= "DOWNLOAD_FILE",
  DOWNLOAD_ERROR = "DOWNLOAD_ERROR",
  SAVE_MESSAGE = "SAVE_MESSAGES",
  MESSAGES_ERROR = "MESSAGES_ERROR"
}

// export const addMessage = (newChatHistoryObj) => {
//   return {
//     type: ADD_NEW_MESSAGE,
//     payload: newChatHistoryObj
//   }
// }

export const saveMessage = (username, newChatHistoryObj: MessageEvent) => async dispatch => { 
  try{
      const res = await axios.post(`http://localhost:8080/saveMessage/${username}`)
      dispatch( {
          type: actionTypes.SAVE_MESSAGE,
          payload: username, newChatHistoryObj

      })
  }
  catch(e){
      dispatch( {
          type: actionTypes.MESSAGES_ERROR,
          payload: console.log(e),
      })
  }
}  

// use typescript enum rather than action constants

export const messageActions = {
  addMessage:(newChatHistoryObj: MessageEvent) => action(actionTypes.ADD_MESSAGE, newChatHistoryObj),
  saveMessage:(username: string, newChatHistoryObj: MessageEvent) => action(actionTypes.SAVE_MESSAGE, username, newChatHistoryObj),
  deleteMessages:() => action(actionTypes.DELETE_MESSAGES),
}


export type RootAction = ActionType<typeof import('./chatActions')>;
