import Axios from 'axios';
import {
    LOGIN_USER, REGISTER_USER, AUTH_USER
} from '../_actions/types';


export function loginUser(dataToSubmit) {
    
    const request = Axios.post('/api/users/login', dataToSubmit)
        .then(response => response.data);

    // request를 reducer로 넘기는 작업
    return {
        type: LOGIN_USER,
        payload: request
    };
}

export function registerUser(dataToSubmit) {
    
    const request = Axios.post('/api/users/register', dataToSubmit)
        .then(response => response.data);

    // request를 reducer로 넘기는 작업
    return {
        type: REGISTER_USER,
        payload: request
    };
}

// [AUTH]
export function auth() {
    
    const request = Axios.get('/api/users/auth')
        .then(response => response.data);

    // request를 reducer로 넘기는 작업
    return {
        type: AUTH_USER,
        payload: request
    };
}