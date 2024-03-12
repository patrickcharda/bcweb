import { API_PENDING, API_SUCCESS, API_ERROR, API_EMPTY_DATA, DEFINE_MESSAGE } from "./actions";

const initialState = { 
    loading: false,
    data: '',
    error: '',
    message:'',
};

const apiReducer = (state=initialState, action) => {
    switch(action.type){
        case API_PENDING:
            return {
                ...state,
                loading: true,
            };
        case API_SUCCESS:
            return {
                ...state,
                data: action.payload,
                loading: false,
                message: '',
            };
        case API_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false, message: "Le serveur rencontre un problème. Veuillez réessayer ultérieurement. ",
            };
        case API_EMPTY_DATA:
            return {
                ...state,
                data:'',
            }
        case DEFINE_MESSAGE:
            return {
                ...state,
                message: action.payload,
            }
        default:
            return state;
    }
}

export default apiReducer