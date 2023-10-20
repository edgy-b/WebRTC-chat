export const ADD_USER = 'ADD_USER';
export const REMOVE_USER = 'REMOVE_USER';

export const addUserAction = (userName: string, stream: MediaStream) => ({
    type: ADD_USER,
    payload: { userName, stream }
})

export const removeUserAction = (userName: string, stream: MediaStream) => ({
    type: REMOVE_USER,
    payload: { userName, stream }
})