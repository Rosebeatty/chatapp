import { ActionType } from "typesafe-actions";
import { ThunkAction } from 'redux-thunk'
import axios from 'axios'

export enum actionTypes {
    DOWNLOAD_FILE= "DOWNLOAD_FILE",
    DOWNLOAD_ERROR = "DOWNLOAD_ERROR"
  }

export const downloadFile = () => async dispatch => { 
    try{
        const res = await axios.get(`http://localhost:8080/download`)
        dispatch( {
            type: actionTypes.DOWNLOAD_FILE,
            payload: console.log(res)

        })
    }
    catch(e){
        dispatch( {
            type: actionTypes.DOWNLOAD_ERROR,
            payload: console.log(e),
        })
    }
}  

