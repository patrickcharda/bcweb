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
export const FETCH_ACC_SUCCESS = "FETCH_ACC_SUCCESS"
export const PURGE_PCES_ACCS = "PURGE_PCES_ACCS"
export const CHANGE_PCE_LOADED_STATUS = "CHANGE_PCE_LOADED_STATUS";

//action creators for API to get pces and accs
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

export const fetchSuccess = (data) => ({
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