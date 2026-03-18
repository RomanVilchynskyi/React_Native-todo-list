import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TodosState {
  uncompletedCount: number;
}

const initialState: TodosState = {
  uncompletedCount: 0,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setUncompletedCount(state, action: PayloadAction<number>) {
      state.uncompletedCount = action.payload;
    },
  },
});

export const { setUncompletedCount } = todosSlice.actions;
export default todosSlice.reducer;