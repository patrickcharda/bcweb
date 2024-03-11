import { cloneDeep } from 'lodash';
import {
  FETCH_ACC_SUCCESS,
  FETCH_PCE_SUCCESS,
  LOAD_FULL_PCES_TAB,
  LOAD_LOADED_PCES_TAB,
  LOAD_PROP_PCES_TAB,
  LOAD_OTHER_PCES_TAB,
  PURGE_PCES_ACCS,
  API_PENDING_PCES_ACCS,
  CHANGE_PCE_LOADED_STATUS,
  CHANGE_PCE_DATE,
  CHANGE_PCE_LOADED_DATE,
  CHANGE_PCE_PROP_DATE,
  CHANGE_PCE_OTHER_DATE,
  CHANGE_PCE_OBSERV_BC,
  LOAD_LOADED_ACCS,
  LOAD_PROP_ACCS,
  LOAD_ACCS,
  CHANGE_ACC_QTE,
} from "./actions";

const initialState = {
  loading: false,
  pces: [],
  pcesLoaded:[],
  pcesProp:[],
  pcesOther:[],
  accs: [],
  accsLoaded:[],
  accsProp:[],
};

const pcesAccsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_ACC_QTE:
      let obj = action.payload;
      console.log("OBJ OBJ OBJ "+obj.id)
      let qte = obj.qte;
      let id = obj.id;
      let charge = obj.charge;
      let newArrayAccs = cloneDeep(state.accs);
      let newArrayLoadedAccs = cloneDeep(state.accsLoaded);
      let newArrayPropAccs = cloneDeep(state.accsProp);
      const indexAccs = newArrayAccs.findIndex(acc => acc.id === id);
      newArrayAccs[indexAccs].pdt_qte = qte;
      if (charge) {
        const indexLoadedAccs = newArrayLoadedAccs.findIndex(acc => acc.id === id);
        newArrayLoadedAccs[indexLoadedAccs].pdt_qte = qte;
      } else {
        const indexPropAccs = newArrayPropAccs.findIndex(acc => acc.id === id);
        newArrayPropAccs[indexPropAccs].pdt_qte = qte;
      }
      return {
        ...state, 
        accsLoaded: newArrayLoadedAccs,
        accsProp: newArrayPropAccs,
        accs: newArrayAccs,
      } 
      /* return {
        ...state,
      } */
    case CHANGE_PCE_OBSERV_BC:
      let modifiedElement = Object.assign({},action.payload.piece);
      let observ= action.payload.texte;
      //console.log("MODIFIED ELEMENT "+JSON.stringify(modifiedElement));
      //console.log("OBSERVATIONS "+observ);
      const new_ArrayPces = cloneDeep(state.pces);//JSON.parse(JSON.stringify(state.pces)); //[...state.pces];
      const new_ArrayPcesLoaded = cloneDeep(state.pcesLoaded);
      const new_ArrayPcesProp = cloneDeep(state.pcesProp);
      const new_ArrayPcesOther = cloneDeep(state.pcesOther);
      // on prépare tout de suite le changement de la valeur du champ d'observations pce_observ_bc dans la liste pces
      const index_Pces = new_ArrayPces.findIndex(pce => pce.id === modifiedElement.id);
      //console.log(new_ArrayPces[index_Pces].pce_observ_bc);
      new_ArrayPces[index_Pces].pce_observ_bc = observ; 
      // si c'est une pièce chargée
      if (modifiedElement.pce_charge) {
        const index_PcesLoaded = new_ArrayPcesLoaded.findIndex(pce => pce.id === modifiedElement.id);
        new_ArrayPcesLoaded[index_PcesLoaded].pce_observ_bc = observ; 
      } else if (modifiedElement.pce_prop_charge) {
        // sinon si c'est une pièce proposée
        const index_PcesProp = new_ArrayPcesProp.findIndex(pce => pce.id === modifiedElement.id);
        new_ArrayPcesProp[index_PcesProp].pce_observ_bc = observ; 
      } else {
        // sinon c'est une pièce autre
        const index_PcesOther = new_ArrayPcesOther.findIndex(pce => pce.id === modifiedElement.id);
        new_ArrayPcesOther[index_PcesOther].pce_observ_bc = observ; 
      }
      return {
        ...state, 
        pcesLoaded: new_ArrayPcesLoaded,
        pcesProp: new_ArrayPcesProp,
        pcesOther: new_ArrayPcesOther,
        pces: new_ArrayPces,
      }
      
        
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
      
    case CHANGE_PCE_DATE:
      // récupérer la date du jour
      let dateMajBLModifie = new Date();
      //formater la date pr la persister
      let formatedDate =
        dateMajBLModifie.getFullYear() +
        "-" +
        (dateMajBLModifie.getMonth() + 1) +
        "-" +
        dateMajBLModifie.getDate();
      formatedDate +=
        "T" +
        dateMajBLModifie.getHours() +
        ":" +
        dateMajBLModifie.getMinutes() +
        ":" +
        dateMajBLModifie.getSeconds();
      //console.log(formatedDate);
      // Modifier date ds liste pces
      let newTabPces = cloneDeep(state.pces);
      let indexPce = newTabPces.findIndex(pce => pce.id === action.payload.id);
      //console.log("index tableau "+indexPce);
      newTabPces[indexPce].pce_date_web = formatedDate; // on change la date de la pce ds la liste des pces
      //console.log(newTabPces[indexPce]);
      return {
        ...state, 
        pces: newTabPces,
      }  
    case CHANGE_PCE_LOADED_DATE:
      // récupérer la date du jour
      let dateMajBLModif = new Date();
      //formater la date pr la persister
      let formatedDat =
        dateMajBLModif.getFullYear() +
        "-" +
        (dateMajBLModif.getMonth() + 1) +
        "-" +
        dateMajBLModif.getDate();
      formatedDat +=
        "T" +
        dateMajBLModif.getHours() +
        ":" +
        dateMajBLModif.getMinutes() +
        ":" +
        dateMajBLModif.getSeconds();
      //console.log(formatedDat);
      // Modifier date ds liste pces chargées
      let newTabPcesLoaded = cloneDeep(state.pcesLoaded);
      let indexPceLoaded = newTabPcesLoaded.findIndex(pce => pce.id === action.payload.id);
      //console.log("index tableau "+indexPceLoaded);
      newTabPcesLoaded[indexPceLoaded].pce_date_web = formatedDat; // on change la date de la pce ds la liste des pces chargées
      //console.log(newTabPcesLoaded[indexPceLoaded]);
      return {
        ...state, 
        pcesLoaded: newTabPcesLoaded,
      }
    case CHANGE_PCE_PROP_DATE:
      // récupérer la date du jour
      let dateMajBLChanged = new Date();
      //formater la date pr la persister
      let formatDate =
        dateMajBLChanged.getFullYear() +
        "-" +
        (dateMajBLChanged.getMonth() + 1) +
        "-" +
        dateMajBLChanged.getDate();
      formatDate +=
        "T" +
        dateMajBLChanged.getHours() +
        ":" +
        dateMajBLChanged.getMinutes() +
        ":" +
        dateMajBLChanged.getSeconds();
      //console.log(formatDate);
      // Modifier date ds liste pces proposées
      let newTabPcesProp = cloneDeep(state.pcesProp);
      let indexPceProp = newTabPcesProp.findIndex(pce => pce.id === action.payload.id);
      //console.log("index tableau "+indexPceProp);
      newTabPcesProp[indexPceProp].pce_date_web = formatDate; // on change la date de la pce ds la liste des pces proposées
      //console.log(newTabPcesProp[indexPceProp]);
      return {
        ...state, 
        pcesProp: newTabPcesProp,
      }  
    case CHANGE_PCE_OTHER_DATE:
      // récupérer la date du jour
      let dateMajBLChange = new Date();
      //formater la date pr la persister
      let formDate =
        dateMajBLChange.getFullYear() +
        "-" +
        (dateMajBLChange.getMonth() + 1) +
        "-" +
        dateMajBLChange.getDate();
      formDate +=
        "T" +
        dateMajBLChange.getHours() +
        ":" +
        dateMajBLChange.getMinutes() +
        ":" +
        dateMajBLChange.getSeconds();
      //console.log(formDate);
      // Modifier date ds liste pces proposées
      let newTabPcesOther = cloneDeep(state.pcesOther);
      let indexPceOther = newTabPcesOther.findIndex(pce => pce.id === action.payload.id);
      //console.log("index tableau "+indexPceOther);
      newTabPcesOther[indexPceOther].pce_date_web = formDate; // on change la date de la pce ds la liste des pces proposées
      //console.log(newTabPcesOther[indexPceOther]);
      return {
        ...state, 
        pcesOther: newTabPcesOther,
      } 
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
    case LOAD_FULL_PCES_TAB:
      return {
        ...state,
        pces: action.payload,
      }
    case LOAD_LOADED_PCES_TAB:
      return {
        ...state,
        pcesLoaded: action.payload,
      }
    case LOAD_PROP_PCES_TAB:
      return {
        ...state,
        pcesProp: action.payload,
      }
    case LOAD_OTHER_PCES_TAB:
      return {
        ...state,
        pcesOther: action.payload,
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
        accsLoaded: [],
        accsProp: [],
        pcesLoaded: [],
        pcesProp: [],
        pcesOther: [],
      }
    case LOAD_LOADED_ACCS:
      return {
        ...state,
        accsLoaded: action.payload,
      }
    case LOAD_PROP_ACCS:
      return {
        ...state,
        accsProp: action.payload,
      }
    case LOAD_ACCS:
      return {
        ...state,
        accs: action.payload,
      }
    default:
      return state;
  }
};

export default pcesAccsReducer;