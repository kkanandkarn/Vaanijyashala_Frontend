import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Permission {
    id: string,
    permissionName: string
    status: string,
    createdAt?: string,
    updatedAt?: string
}

export interface AuthData {
    userId: string;
    userName: string;
    email: string;
    role: string;
    token: string;
    permissions: Permission[]
}

const initialState: AuthData = {
    userId: "",
    userName: "",
    email: "",
    role: "",
    token: "",
    permissions: []
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<AuthData>) {
            const { userId, userName, email, role, token, permissions } = action.payload;
            state.userId = userId;
            state.userName = userName;
            state.email = email;
            state.role = role;
            state.token = token;
            state.permissions = permissions
        },
        updatePermissions(state, action: PayloadAction<Permission[]>) {
            state.permissions = action.payload;
          },
        logout(state) {
            state.userId = "";
            state.userName = "";
            state.email = "";
            state.role = "";
            state.token = "";
            state.permissions = []
        }
    }
});

export const { login, logout,updatePermissions  } = authSlice.actions;
export default authSlice.reducer;
