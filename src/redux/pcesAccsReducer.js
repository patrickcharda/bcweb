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
  pcesLoaded:[],
  pcesProp:[],
  pcesOther:[],
};

const pcesAccsReducer = (state = initialState, action) => {
  switch (action.type) {
    case API_PENDING_PCES_ACCS:
      return {
        ...state,
        loading: true,
      };
    case FETCH_PCE_SUCCESS:
      if (action.payload && action.payload.pce_charge) {
        return {
          ...state,
          pces: [...state.pces, action.payload],
          pcesLoaded: [...state.pcesLoaded, action.payload],
          loading: false,
        } 
      } else if (action.payload && action.payload.pce_prop_charge) {
        return {
          ...state,
          pces: [...state.pces, action.payload],
          pcesProp: [...state.pcesProp, action.payload],
          loading: false,
        }
      } else {
        return {
          ...state,
          pces: [...state.pces, action.payload],
          pcesOther: [...state.pcesOther, action.payload],
          loading: false,
        }
      }
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
        pcesLoaded: [],
        pcesProp: [],
        pcesOther: [],
      };
    default:
      return state;
  }
};

export default pcesAccsReducer;
