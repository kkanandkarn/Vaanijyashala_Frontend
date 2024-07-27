import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Loading {
   loading: boolean
}
const initialState = {
    loading : false
}

const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        loading(state, action: PayloadAction<Loading>) {
            const { loading } = action.payload;
            state.loading = loading;
        },

    }
});

export const { loading  } = loadingSlice.actions;
export default loadingSlice.reducer;