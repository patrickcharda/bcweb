import {
  ADD_TOKEN,
  ADD_REFRESH_TOKEN,
  TOGGLE_IS_LOGGED,
  SIGNOUT,
  ADD_USER,
} from "./actions";

const initialState = {
  token: "",
  refreshToken: "",
  isLogged: false,
  username: "",
};

const tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case ADD_REFRESH_TOKEN:
      return {
        ...state,
        refreshToken: action.payload,
      };
    case ADD_USER:
      return {
        ...state,
        username: action.payload,
      };
    case TOGGLE_IS_LOGGED:
      return {
        ...state,
        isLogged: !action.payload,
      };
    case SIGNOUT:
      return {
        ...state,
        token: "",
        refreshToken: "",
        isLogged: false,
        username: "",
      };
    default:
      return state;
  }
};

export default tokenReducer;
