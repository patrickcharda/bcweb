import { RECORD_SELECTED_BC } from "./actions";

const initialState = {
  bc: {},
};

const bcReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECORD_SELECTED_BC:
      return {
        ...state,
        bc: action.payload,
      };
    default:
      return state;
  }
};

export default bcReducer;
