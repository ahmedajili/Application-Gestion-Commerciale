import { createSlice } from "@reduxjs/toolkit";
import { addNewCategorie, deleteCategorie, getCategoriesArticles, updateCategorie } from './thunk';

export const initialState = {
    categoriesArticles: [],
    loading: false,
    error: null,
    isCategoriesSuccess: false,
  };

  const CategoriesArticlesSlice = createSlice({
    name: 'CategoriesArticlesSlice',
    initialState,
    reducer: {},
    extraReducers: (builder) => {
      builder.addCase(getCategoriesArticles.pending, (state) => {
        state.error = null;
        state.loading = true;
      });

      builder.addCase(getCategoriesArticles.fulfilled, (state, action) => {
        state.categoriesArticles = action.payload;
        state.loading = false;
        state.isCategoriesCreated = false;
        state.isCategoriesSuccess = true;
      });
  
      builder.addCase(getCategoriesArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
        state.isCategoriesCreated = false;
        state.isCategoriesSuccess = false;
      });

      builder.addCase(addNewCategorie.fulfilled, (state, action) => {
            state.categoriesArticles.push(action.payload);
            //  Tri après ajout (ordre alphabétique par libelle)
            state.categoriesArticles.sort((a, b) =>
            a.libelle.localeCompare(b.libelle)
            );
            state.isCategoriesCreated = true;
     });
      builder.addCase(addNewCategorie.rejected, (state, action) => {
            state.error = action.error.message || null;
     });

      builder.addCase(updateCategorie.fulfilled, (state, action) => {
           state.categoriesArticles = state.categoriesArticles.map(categorie =>
            categorie.id.toString() === action.payload.id.toString()
               ? { ...categorie, ...action.payload }
               : categorie
           );
         });
         builder.addCase(updateCategorie.rejected, (state, action) => {
           state.error = action.error.message || null;
         });

      builder.addCase(deleteCategorie.fulfilled, (state, action) => {
            state.categoriesArticles = state.categoriesArticles.filter(
              categorie => categorie.id.toString() !== action.payload.idcategorie.toString()
            );
          });
          builder.addCase(deleteCategorie.rejected, (state, action) => {
            state.error = action.error.message || null;
          });
  
      
    }
  });

  export default CategoriesArticlesSlice.reducer;
