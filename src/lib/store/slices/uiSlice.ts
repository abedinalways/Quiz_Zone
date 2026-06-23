import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  sidebarOpen: boolean
  theme: "light" | "dark" | "system"
  activeModal: string | null
}

const initialState: UiState = {
  sidebarOpen: false,
  theme: "system",
  activeModal: null,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action: PayloadAction<UiState["theme"]>) => {
      state.theme = action.payload
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarOpen, setTheme, setActiveModal } =
  uiSlice.actions
export default uiSlice.reducer
