import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface UserState {
   user: any;
   activePageTag: string;
}

const initialState: UserState = {
   user: null,
   activePageTag: '',
}

const userSlice = createSlice({
   name: 'user',
   initialState,
   reducers: {

      loginUser: (state, { payload }: PayloadAction<any>) => {
         return {
            ...state,
            user: payload,
         }
      },

      logoutUser: (state) => {
         return { ...state, user: null }
      },

      setActivePageTag: (state, { payload }: PayloadAction<string>) => {
         return { ...state, activePageTag: payload }
      },
   }
});

export const {
   loginUser,
   logoutUser,
   setActivePageTag,
} = userSlice.actions

export default userSlice.reducer