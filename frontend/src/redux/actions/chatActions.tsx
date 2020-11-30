// import { ADD_NEW_MESSAGE } from '../types/types';
import { action, ActionType } from "typesafe-actions";


export enum actionTypes {
  ADD_NEW_MESSAGE = "ADD_NEW_MESSAGE",
  DELETE_MESSAGES = "DELETE_MESSAGES",
  GET_USERS = "GET_USERS",
  USERS_ERROR = "USERS_ERROR",
  DOWNLOAD_FILE= "DOWNLOAD_FILE",
  DOWNLOAD_ERROR = "DOWNLOAD_ERROR"
}

// export const addMessage = (newChatHistoryObj) => {
//   return {
//     type: ADD_NEW_MESSAGE,
//     payload: newChatHistoryObj
//   }
// }

// use typescript enum rather than action constants

export const messageActions = {
  addMessage:(newChatHistoryObj: MessageEvent) => action(actionTypes.ADD_NEW_MESSAGE, newChatHistoryObj),
  deleteMessages:() => action(actionTypes.DELETE_MESSAGES),
}


export type RootAction = ActionType<typeof import('./chatActions')>;
