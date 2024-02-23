import axios from "axios";
import { fetchData, fetchSuccess, fetchError, signout, fetchPceSuccess, fetchAccSuccess, fetchDataPcesAccs } from "./actions";
import * as Device from 'expo-device';
import * as Application from 'expo-application';

const appliname = "bcweb";
const fingerprint = Application.getAndroidId().toString()+Application.nativeBuildVersion+Device.deviceYearClass.toString();

const apiCall = (url, token, tableau = []) => (dispatch) => {
  console.log("FINGERPRINT "+fingerprint);
  const config = {
    headers: { Authorization: `Bearer ${token}`, appliname:appliname, fingerprint:fingerprint },
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
    dispatch(fetchDataPcesAccs());
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
  if (url.includes("/bcweb/reprise/")) {
    dispatch(fetchData());
    return new Promise(() => {
      let username = {"username": tableau[0]};
      axios
        .post(url, username, config)
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
  if (url.includes("/bcweb/ouvrir/")) {
    dispatch(fetchData());
    return new Promise(() => {
      let data = {
        "username": tableau[0],
        "bc_num": tableau[1]
      };
      axios
        .post(url, data, config)
        .then((response) => {
          switch (response.status) {
            case 401:
            case 403:
              dispatch(signout());
              break;
            case 200:
              console.log("commande ouvrir ok");
              break;
            case 201:
            case 202:
              console.log("commande ouvrir OK");
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
  if (url.includes("/bcweb/checkok/")) {
    dispatch(fetchData());
    return new Promise(() => {
      let data = {
        "username": tableau[0],
      };
      axios
        .post(url, data, config)
        .then((response) => {
          switch (response.status) {
            case 401:
            case 403:
              dispatch(signout());
              break;
            case 200:
              console.log("commande checkok ok");
              break;
            case 201:
            case 202:
              console.log("commande checkok OK OK");
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
  if (url.includes("/bcweb/pdt")) {
    dispatch(fetchDataPcesAccs());
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