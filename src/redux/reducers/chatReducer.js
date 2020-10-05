import { ADD_NEW_STUDENT, ADD_ALL_STUDENTS } from './../types/types';

// CREATE THE REDUCER
const initialState = [];

const chatReducer = ((state = initialState, action) => {
  switch(action.type) {
    case ADD_NEW_STUDENT:
      return [...state, action.payload]
    case ADD_ALL_STUDENTS:
      return action.payload
    default:
      return state
  }
});

export default chatReducer;