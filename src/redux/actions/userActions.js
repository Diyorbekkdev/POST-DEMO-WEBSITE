import { ADD_USER_SUCCESS, DELETE_USER_SUCCESS, FETCH_USERS_SUCCESS, LIMIT, UPDATE_USER_SUCCESS } from "../../const";
import { request } from "../../server/request";

export const fetchUsersSuccess = (users) => ({
    type: FETCH_USERS_SUCCESS,
    payload: users,
  });
  
  export const addUserSuccess = (user) => ({
    type: ADD_USER_SUCCESS,
    payload: user,
  });
  
  export const updateUserSuccess = (user) => ({
    type: UPDATE_USER_SUCCESS,
    payload: user,
  });
  
  export const deleteUserSuccess = (userId) => ({
    type: DELETE_USER_SUCCESS,
    payload: userId,
  });
  
  export const fetchUsers = (page, searchQuery) => async (dispatch) => {
    try {
      const response = await request.get(`user/${page}/${LIMIT}/${searchQuery}`);
      dispatch(fetchUsersSuccess(response.data));
    } catch (error) {
      console.error(error);
    }
  };
  
  export const addUser = (userData) => async (dispatch) => {
    try {
      const response = await request.post("user", userData);
      dispatch(addUserSuccess(response.data));
    } catch (error) {
      console.error(error);
    }
  };
  
  export const updateUser = (userId, userData) => async (dispatch) => {
    try {
      const response = await request.put(`user/${userId}`, userData);
      dispatch(updateUserSuccess(response.data));
    } catch (error) {
      console.error(error);
    }
  };
  
  export const deleteUser = (userId) => async (dispatch) => {
    try {
      await request.delete(`user/${userId}`);
      dispatch(deleteUserSuccess(userId));
    } catch (error) {
      console.error(error);
    }
  };