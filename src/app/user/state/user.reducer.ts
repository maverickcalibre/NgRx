import { User } from "../user";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export interface UserState{
    maskUserName: boolean,
    currentUser: User
}

export const initialState: UserState = {
    maskUserName: true,
    currentUser: null
};

const getUserFeatureState = createFeatureSelector<UserState>('user');

export const getMaskUserName = createSelector(
    getUserFeatureState,
    state => state.maskUserName    
);

export const getCurrentUser = createSelector(
    getUserFeatureState,
    state => state.currentUser    
);

export function reducer(state: UserState = initialState, action){
    switch (action.type) {
        case 'TOGGLE_MASK_DISPLAY':
            console.log('existing state: '+ JSON.stringify(state));
            console.log('payload: '+ action.payload);
            return {
                ...state,
                maskUserName: action.payload
            };
    
        default:
            return state;
    }
}