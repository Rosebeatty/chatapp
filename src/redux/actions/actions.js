import { ADD_NEW_STUDENT, ADD_ALL_STUDENTS } from './../types/types';

export const addStudent = (newStudentObj) => {
  return {
    type: ADD_NEW_STUDENT,
    payload: newStudentObj
  }
}

export const addAllStudents = (allStudents) => {
  return {
    type: ADD_ALL_STUDENTS,
    payload: allStudents
  }
}