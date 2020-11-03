import { ActionType } from "typesafe-actions";
import { ThunkAction } from 'redux-thunk'
import axios from 'axios'

export enum actionTypes {
    GET_USERS = "GET_USERS",
    USERS_ERROR = "USERS_ERROR"
  }

export const getUsers = () => async dispatch => { 
    try{
        const res = await axios.get(`http://localhost:8080/getUsers`)
        dispatch( {
            type: actionTypes.GET_USERS,
            payload: res.data

        })
    }
    catch(e){
        dispatch( {
            type: actionTypes.USERS_ERROR,
            payload: console.log(e),
        })
    }
}  

