//SAVE_MESSAGE 정의를 types.js에서 가져옴
import {
    SAVE_MESSAGE,
} from './types';

//reducer로 
export function saveMessage(dataToSubmit) {
   
    return {
        type: SAVE_MESSAGE,
        payload: dataToSubmit
    }
}
