
import {
    FETCH_USERS_SUCCESS,
    ADD_USER_SUCCESS,
    UPDATE_USER_SUCCESS,
    DELETE_USER_SUCCESS,
  } from "../../const/index";
  
  const initialState = {
    users: [],
  };
  
  const usersReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_USERS_SUCCESS:
        return {
          ...state,
          users: action.payload,
        };
      case ADD_USER_SUCCESS:
        return {
          ...state,
          users: [...state.users, action.payload],
        };
      case UPDATE_USER_SUCCESS:
        const updatedUsers = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
        return {
          ...state,
          users: updatedUsers,
        };
      case DELETE_USER_SUCCESS:
        const filteredUsers = state.users.filter(
          (user) => user.id !== action.payload
        );
        return {
          ...state,
          users: filteredUsers,
        };
      default:
        return state;
    }
  };
  
  export default usersReducer;
  