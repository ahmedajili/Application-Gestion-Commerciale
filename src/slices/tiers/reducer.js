import { createSlice } from "@reduxjs/toolkit";
import { getTiers } from './thunk';

export const initialState = {
    tiers: [],
    loading: false,
    error: null,
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
      });
  
      builder.addCase(getTiers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  
      
    }
  });

  export default TiersSlice.reducer;
