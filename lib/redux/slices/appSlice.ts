import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Language } from "@/types"

interface AppState {
  language: Language
  uploadedDesignForCar: string | null
}

const initialState: AppState = {
  language: "en",
  uploadedDesignForCar: null,
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload
    },
    setUploadedDesignForCar: (state, action: PayloadAction<string | null>) => {
      state.uploadedDesignForCar = action.payload
    },
  },
})

export const { setLanguage, setUploadedDesignForCar } = appSlice.actions
export default appSlice.reducer
