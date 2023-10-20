import { ADD_USER, REMOVE_USER } from './UserActions';

type UserState = Record<string, { stream: MediaStream }>;

type UserAction = 
| {
    type: typeof ADD_USER;
    payload: { userName: string; stream: MediaStream }
}
| {
    type: typeof REMOVE_USER;
    payload: { userName: string }
}

export const UsersReducer = (state: UserState, action: UserAction) => {
    switch (action.type) {
        case ADD_USER:
            return {
                ...state,
                [action.payload.userName]: {
                    stream: action.payload.stream
                }
            };

        case REMOVE_USER:
            const { [action.payload.userName]: deleted, ...rest } = state;

            return rest;

        default:
            return { ...state };
    }
}