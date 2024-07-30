import { configureStore } from "@reduxjs/toolkit";
import themeSliceReducer from "./theme/themeSlice";
export const store = configureStore({
    reducer:{
        themeKey : themeSliceReducer, 
    },
})