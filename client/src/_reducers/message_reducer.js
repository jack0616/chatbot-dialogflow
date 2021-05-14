import {
    SAVE_MESSAGE,
} from '../_actions/types';

//비어있는 array에 대화 정보를 저장
export default function (state = {messages:[]}, action) {
    switch (action.type) {
        case SAVE_MESSAGE:
            return {
                ...state,
                messages: state.messages.concat(action.payload)
            }
        default:
            return state;
    }
}