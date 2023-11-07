import axios from "axios";
import { fetchData, fetchSuccess, fetchError, signout, fetchPceSuccess, fetchAccSuccess } from "./actions";

const apiCall = (url, token) => (dispatch) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  if (url.includes("/bcweb/bc")) {
    dispatch(fetchData());
    return new Promise(() => {
      axios
        .get(url, config)
        .then((response) => {
          switch (response.status) {
            case 401:
            case 403:
              dispatch(signout());
              break;
            case 200:
            case 201:
            case 202:
              dispatch(fetchSuccess(response.data));
              break;
          }
        })
        .catch((error) => {
          dispatch(fetchError(error.message));
          //console.log("erreur : ", error);
        });
    });
  }
  if (url.includes("/bcweb/pce")) {
    dispatch(fetchData());
    return new Promise(() => {
      axios
        .get(url, config)
        .then((response) => {
          switch (response.status) {
            case 401:
            case 403:
              dispatch(signout());
              break;
            case 200:
            case 201:
            case 202:
              dispatch(fetchPceSuccess(response.data));
              break;
          }
        })
        .catch((error) => {
          dispatch(fetchError(error.message));
          //console.log("erreur : ", error);
        });
    });
  }
  if (url.includes("/bcweb/pdt")) {
    dispatch(fetchData());
    return new Promise(() => {
      axios
        .get(url, config)
        .then((response) => {
          switch (response.status) {
            case 401:
            case 403:
              dispatch(signout());
              break;
            case 200:
            case 201:
            case 202:
              dispatch(fetchAccSuccess(response.data));
              break;
          }
        })
        .catch((error) => {
          dispatch(fetchError(error.message));
          //console.log("erreur : ", error);
        });
    });
  }
};

export default apiCall;
