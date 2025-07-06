import { createSlice } from "@reduxjs/toolkit";
import { getTiers } from './thunk';

export const initialState = {
    tiers: [],
    loading: false,
    error: null,
    isTiersSuccess: false,
  };

  const TiersSlice = createSlice({
    name: 'TiersSlice',
    initialState,
    reducer: {},
    extraReducers: (builder) => {
      builder.addCase(getTiers.pending, (state) => {
        state.error = null;
        state.loading = true;
      });

      builder.addCase(getTiers.fulfilled, (state, action) => {
        state.tiers = action.payload;
        state.loading = false;
        state.isTiersCreated = false;
        state.isTiersSuccess = true;
      });
  
      builder.addCase(getTiers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
        state.isTiersCreated = false;
        state.isTiersSuccess = false;
      });
  
      
    }
  });

  export default TiersSlice.reducer;
