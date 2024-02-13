import { cloneDeep } from 'lodash';
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
      let changedElement = Object.assign({},action.payload);
      changedElement.pce_charge = !changedElement.pce_charge; // on permute chargée/déchargée
      const newArrayPces = cloneDeep(state.pces);//JSON.parse(JSON.stringify(state.pces)); //[...state.pces];
      const newArrayPcesLoaded = cloneDeep(state.pcesLoaded);
      const newArrayPcesProp = cloneDeep(state.pcesProp);
      const newArrayPcesOther = cloneDeep(state.pcesOther);
      // on change tout de suite le statut de chargement de la pce ds la future liste des pieces 
      const indexPces = newArrayPces.findIndex(pce => pce.id === action.payload.id);
      newArrayPces[indexPces].pce_charge = changedElement.pce_charge; // on change le statut de la pce ds la liste des pces

      if (action.payload && action.payload.pce_charge === true) {
        // décharger = supprimer piece de la liste des pièces chargées et modifier statut pce ds liste ttes pces
        const indexPcesLoaded = newArrayPcesLoaded.findIndex(pce => pce.id === action.payload.id);
        newArrayPcesLoaded.splice(indexPcesLoaded, 1); //on supprime à l'index

        if (action.payload.pce_prop_charge) {
          // ajouter la pce dans la liste des pièces proposées
          newArrayPcesProp.push(changedElement)
          return {
            ...state, 
            pcesLoaded: newArrayPcesLoaded,
            pcesProp: newArrayPcesProp,
            pces: newArrayPces,
          }
        } else {
          // ajouter la pce ds la liste des autres pces (ni chargées ni proposées)
          newArrayPcesOther.push(changedElement);
          return {
            ...state, 
            pcesLoaded: newArrayPcesLoaded,
            pcesOther: newArrayPcesOther,
            pces: newArrayPces,
          }
        }
      } else {
        // charger la pièce 
        newArrayPcesLoaded.push(changedElement);

        if (action.payload.pce_prop_charge) {
          // supprimer de la liste des pièces proposées (puisque pce passée dans la liste des pces chargées)
          const indexPcesProp = newArrayPcesProp.findIndex(pce => pce.id === action.payload.id);
          newArrayPcesProp.splice(indexPcesProp, 1);
          return {
            ...state,
            pcesLoaded: newArrayPcesLoaded,
            pcesProp: newArrayPcesProp,
            pces: newArrayPces,
          }
        } else {
          // supprimer de la liste des autres pièces (puisque pce passée dans la liste des pces chargées)
          const indexPcesOther = newArrayPcesOther.findIndex(pce => pce.id === action.payload.id);
          newArrayPcesOther.splice(indexPcesOther, 1);
          return {
            ...state,
            pcesLoaded: newArrayPcesLoaded,
            pcesOther: newArrayPcesOther,
            pces: newArrayPces,
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