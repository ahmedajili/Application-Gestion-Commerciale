import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    getCategoriesArticles as getCategoriesArticlesApi,
    addNewCategorie as addNewCategorieApi,
    updateCategorie as updateCategorieApi,
    deleteCategorie as deleteCategorieApi,
  } from "../../helpers/fakebackend_helper";


export const getCategoriesArticles = createAsyncThunk("CategoriesArticles/getCategoriesArticles", async () => {
  try {
    const response = getCategoriesArticlesApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const addNewCategorie = createAsyncThunk("CategoriesArticles/addNewCategorie", async (categorie) => {
  try {
    const response = await addNewCategorieApi(categorie);
    toast.success("Catégorie ajoutée avec succés", { autoClose: 3000 });
    //console.log(response);
    return response;
  } catch (error) {
    toast.error("Echec d'ajout", { autoClose: 3000 });
    return error;
  }
});

export const updateCategorie = createAsyncThunk("CategoriesArticles/updateCategorie", async (categorie) => {
  try {
    const response = updateCategorieApi(categorie);
    const data = await response;
    toast.success("Catégorie modifiée avec succés", { autoClose: 3000 });
    //console.log("la data est " ,data);
    return data;
  } catch (error) {
    toast.error("Echec de modification", { autoClose: 3000 });
    return error;
  }
});

export const deleteCategorie = createAsyncThunk("CategoriesArticles/deleteCategorie", async (idcategorie) => {
  try {
    const response = await deleteCategorieApi(idcategorie);
    toast.success("Catégorie supprimée avec succés", { autoClose: 3000 });
    //console.log({ idcategorie, ...response })
    return { idcategorie, ...response }
  } catch (error) {
    toast.error("Echec de la suppression", { autoClose: 3000 });
    return error;
  }
});