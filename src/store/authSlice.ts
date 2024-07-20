import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthData {
    userId: string;
    userName: string;
    email: string;
    role: string;
    token: string;
}

const initialState: AuthData = {
    userId: "",
    userName: "",
    email: "",
    role: "",
    token: ""
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<AuthData>) {
            const { userId, userName, email, role, token } = action.payload;
            state.userId = userId;
            state.userName = userName;
            state.email = email;
            state.role = role;
            state.token = token;
        },
        logout(state) {
            state.userId = "";
            state.userName = "";
            state.email = "";
            state.role = "";
            state.token = "";
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
