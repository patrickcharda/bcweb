import {
  FETCH_ACC_SUCCESS,
  FETCH_PCE_SUCCESS,
  PURGE_PCES_ACCS,
  API_PENDING_PCES_ACCS,
} from "./actions";

const initialState = {
  pces: [],
  accs: [],
  loading: false,
};

const pcesAccsReducer = (state = initialState, action) => {
  switch (action.type) {
    case API_PENDING_PCES_ACCS:
      return {
        ...state,
        loading: true,
      };
    case FETCH_PCE_SUCCESS:
      return {
        ...state,
        pces: [...state.pces, action.payload],
        loading: false,
      };
    case FETCH_ACC_SUCCESS:
      return {
        ...state,
        accs: [...state.accs, action.payload],
        loading: false,
      };
    case PURGE_PCES_ACCS:
      return {
        ...state,
        pces: [],
        accs: [],
      };
    default:
      return state;
  }
};

export default pcesAccsReducer;
