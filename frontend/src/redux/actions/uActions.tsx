import axios from 'axios'

export enum actionTypes {
    GET_USER = "GET_USER",
    USERS_ERROR = "USERS_ERROR"
  }

export const getUser = (username) => async dispatch => { 
    try{
        const res = await axios.get(`http://localhost:8080/getUser/${username}`)
        dispatch( {
            type: actionTypes.GET_USER,
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
