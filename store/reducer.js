let initialState = {
    "user" : null
};
const userReducer = (state = initialState, action) => {
    if(action.type == "setUser"){
        return {...state, user : action.user}
    }else if(action.type == "unsetUser"){
        return {...state, user : null}
    }
    return state;
}

export default userReducer;