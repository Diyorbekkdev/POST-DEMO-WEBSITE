import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import usersReducer from "../reducers/userReducer";

const rootReducer = combineReducers({
  users: usersReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;