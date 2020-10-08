// import { ADD_NEW_MESSAGE } from '../types/types';
import { action, ActionType } from "typesafe-actions";


export enum actionTypes {
  ADD_NEW_MESSAGE = "ADD_NEW_MESSAGE",
}

// export const addMessage = (newChatHistoryObj) => {
//   return {
//     type: ADD_NEW_MESSAGE,
//     payload: newChatHistoryObj
//   }
// }

// use typescript enum rather than action constants

export const todoActions = {
  addMessage:(newChatHistoryObj: string) => action(actionTypes.ADD_NEW_MESSAGE, newChatHistoryObj)
};

export type RootAction = ActionType<typeof import('../actions/actions')>;
