export function reducer(state, action){
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