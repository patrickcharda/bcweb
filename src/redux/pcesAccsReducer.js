import {
  FETCH_ACC_SUCCESS,
  FETCH_PCE_SUCCESS,
  PURGE_PCES_ACCS,
  API_PENDING_PCES_ACCS,
  CHANGE_PCE_LOADED_STATUS,
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
    case CHANGE_PCE_LOADED_STATUS:
      if (action.payload && action.payload.pce_charge) {
        // supprimer piece de la liste des pièces chargées
        const index1 = state.pcesLoaded.findIndex(pce => pce.pce_id === action.payload.pce_id);
        const newArray1 = [...state.pcesLoaded];
        newArray1.splice(index1, 1);
        if (action.payload.pce_prop_charge) {
          // ajouter la pce dans la liste des pièces proposées
          const newArray2 = [...state.pcesProp];
          action.payload.pce_charge = false; 
          newArray2.push(action.payload)
          return {
            ...state, 
            pcesLoaded: newArray1,
            pcesProp: newArray2,
          }
        } else {
          // ajouter la pce ds la liste des autres pces (ni chargées ni proposées)
          const newArray3 = [...state.pcesOther];
          action.payload.pce_charge = false; 
          newArray3.push(action.payload);
          return {
            ...state, 
            pcesLoaded: newArray1,
            pcesOther: newArray3,
          }
        }
      } else {
        // charger la pièce
        action.payload.pce_charge = true;
        const newArray1 = [...state.pcesLoaded];
        newArray1.push(action.payload);
        if (action.payload.pce_prop_charge) {
          // supprimer de la liste des pièces proposées
          const index1 = state.pcesProp.findIndex(pce => pce.pce_id === action.payload.pce_id);
          const newArray2 = [...state.pcesProp];
          newArray2.splice(index1, 1);
          return {
            ...state,
            pcesLoaded: newArray1,
            pcesProp: newArray2,
          }
        } else {
          // supprimer de la liste des autres pièces 
          const index2 = state.pcesOther.findIndex(pce => pce.pce_id === action.payload.pce_id);
          const newArray3 = [...state.pcesOther];
          newArray3.splice(index2, 1);
          return {
            ...state,
            pcesLoaded: newArray1,
            pcesOther: newArray3,
          }
        }
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
