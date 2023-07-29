import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import usersReducer from "../reducers/userReducer";
import { categoryReducer } from "../reducers/categoryReducer";

const rootReducer = combineReducers({
  users: usersReducer,
  category: categoryReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;