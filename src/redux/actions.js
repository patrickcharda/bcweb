import storeAndPersistor from "./store";
const { persistor } = storeAndPersistor;

//action's type for login
export const ADD_TOKEN = "ADD_TOKEN";
export const ADD_REFRESH_TOKEN = "ADD_REFRESH_TOKEN";
export const ADD_USER = "ADD_USER";
export const TOGGLE_IS_LOGGED = "TOGGLE_IS_LOGGED";
export const SIGNOUT = "SIGNOUT";

//action's type for api
export const API_PENDING = "API_PENDING";
export const API_SUCCESS = "API_SUCCESS";
export const API_ERROR = "API_ERROR";
export const API_EMPTY_DATA = "API_EMPTY_DATA"
export const API_PENDING_PCES_ACCS = "API_PENDING_PCES_ACCS"

//action's type for bc
export const RECORD_SELECTED_BC = "RECORD_SELECTED_BC";
export const PURGE_BC = "PURGE_BC";
//action's type for pces and accs (pièces et accessoires)
export const FETCH_PCE_SUCCESS = "FETCH_PCE_SUCCESS"
export const LOAD_FULL_PCES_TAB = "LOAD_FULL_PCES_TAB"
export const LOAD_LOADED_PCES_TAB = "LOAD_LOADED_PCES_TAB"
export const LOAD_PROP_PCES_TAB = "LOAD_PROP_PCES_TAB"
export const LOAD_OTHER_PCES_TAB = "LOAD_OTHER_PCES_TAB"
export const FETCH_ACC_SUCCESS = "FETCH_ACC_SUCCESS"
export const PURGE_PCES_ACCS = "PURGE_PCES_ACCS"
export const CHANGE_PCE_LOADED_STATUS = "CHANGE_PCE_LOADED_STATUS";
export const CHANGE_PCE_DATE = "CHANGE_PCE_DATE";
export const CHANGE_PCE_LOADED_DATE = "CHANGE_PCE_LOADED_DATE";
export const CHANGE_PCE_PROP_DATE = "CHANGE_PCE_PROP_DATE";
export const CHANGE_PCE_OTHER_DATE = "CHANGE_PCE_OTHER_DATE";
export const CHANGE_PCE_OBSERV_BC = "CHANGE_PCE_OBSERV_BC";
export const LOAD_LOADED_ACCS = "LOAD_LOADED_ACCS";
export const LOAD_PROP_ACCS = "LOAD_PROP_ACCS";
export const LOAD_ACCS = "LOAD_ACCS";
export const CHANGE_ACC_QTE = "CHANGE_ACC_QTE";

//action creators for API to get pces and accs
export const changeAccQte = (obj) => {
  return {
    type: CHANGE_ACC_QTE,
    payload: obj,
  }
}
export const changePceObservBc = (data) => {
  return {
    type: CHANGE_PCE_OBSERV_BC,
    payload: data,
  };
};
export const changePceDate = (pce) => {
  return {
    type: CHANGE_PCE_DATE,
    payload: pce,
  };
};
export const changePceLoadedDate = (pce) => {
  return {
    type: CHANGE_PCE_LOADED_DATE,
    payload: pce,
  };
};
export const changePcePropDate = (pce) => {
  return {
    type: CHANGE_PCE_PROP_DATE,
    payload: pce,
  };
};
export const changePceOtherDate = (pce) => {
  return {
    type: CHANGE_PCE_OTHER_DATE,
    payload: pce,
  };
};
export const changePceLoadedStatus = (pce) => {
  return {
    type: CHANGE_PCE_LOADED_STATUS,
    payload: pce,
  };
};

export const fetchPceSuccess = (pce) => {
  return {
    type: FETCH_PCE_SUCCESS,
    payload: pce,
  };
};

export const loadFullPcesTab = (tabPces) => {
  return {
    type: LOAD_FULL_PCES_TAB,
    payload: tabPces,
  }
} 
export const loadLoadedPcesTab = (tabPcesLoaded) => {
  return {
    type: LOAD_LOADED_PCES_TAB,
    payload: tabPcesLoaded,
  }
} 
export const loadPropPcesTab = (tabPcesProp) => {
  return {
    type: LOAD_PROP_PCES_TAB,
    payload: tabPcesProp,
  }
} 
export const loadOtherPcesTab = (tabPcesOther) => {
  return {
    type: LOAD_OTHER_PCES_TAB,
    payload: tabPcesOther,
  }
}
export const fetchAccSuccess = (acc) => {
  return {
    type: FETCH_ACC_SUCCESS,
    payload: acc,
  }
}
export const purgePcesAccs = () => {
  return {
    type: PURGE_PCES_ACCS,
  }
}
export const loadLoadedAccs = (accsTab) => {
  return {
    type: LOAD_LOADED_ACCS,
    payload: accsTab,
  }
}
export const loadPropAccs = (accsTab) => {
  return {
    type: LOAD_PROP_ACCS,
    payload: accsTab,
  }
}
export const loadAccs = (accsTabs) => {
  return {
    type: LOAD_ACCS,
    payload: accsTabs,
  }
}
//action creators for bc
export const recordSelectedBc = (bc) => {
  return {
    type: RECORD_SELECTED_BC,
    payload: bc,
  };
};
export const purgeBc = () => {
  return {
    type: PURGE_BC,
  }
}

//action creators for login
export const addToken = (token) => {
  return {
    type: ADD_TOKEN,
    payload: token,
  };
};

export const addRefreshToken = (refreshToken) => {
  return {
    type: ADD_REFRESH_TOKEN,
    payload: refreshToken,
  };
};

export const addUser = (username) => {
  return {
    type: ADD_USER,
    payload: username,
  }
}

export const toggleIsLogged = (isLogged) => {
  return {
    type: TOGGLE_IS_LOGGED,
    payload: isLogged,
  };
};

export const signout = () => {
  persistor.purge();
  return {
    type: SIGNOUT,
  };
};

// action creators for API

export const fetchData = () => ({
  type: API_PENDING,
});

export const fetchDataPcesAccs = () => ({
  type: API_PENDING_PCES_ACCS,
});

export const fetchSuccess = (data) => (
  //console.log("the data : "+JSON.stringify(data)),
  {
  type: API_SUCCESS,
  payload: data,
});

export const fetchError = (error) => ({
  type: API_ERROR,
  payload: error,
});

export const apiEmptyData = () => ({
  type: API_EMPTY_DATA
});