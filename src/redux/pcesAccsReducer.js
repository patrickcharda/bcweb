import { FETCH_ACC_SUCCESS, FETCH_PCE_SUCCESS } from "./actions";

const initialState = {
  pces: [],
  accs:[],
};

const pcesAccsReducer = (state = initialState, action) => {
  switch (action.type) {
    case  FETCH_PCE_SUCCESS:
      return {
        ...state,
        pces: [...state.pces, action.payload],
      };
    case FETCH_ACC_SUCCESS:
      return {
        ...state,
        accs: [...state.accs, action.payload],
      }
    default:
      return state;
  }
};

export default pcesAccsReducer;
