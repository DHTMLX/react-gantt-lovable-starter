import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GanttSnapshot, SerializedTask, SerializedLink } from "./types";

const MAX_HISTORY = 50;

interface GanttHistoryState {
  past: GanttSnapshot[];
  present: GanttSnapshot;
  future: GanttSnapshot[];
}

const emptySnapshot: GanttSnapshot = { tasks: [], links: [] };

const initialState: GanttHistoryState = {
  past: [],
  present: emptySnapshot,
  future: [],
};

const ganttSlice = createSlice({
  name: "gantt",
  initialState,
  reducers: {
    /** Load data from DB — replaces present WITHOUT pushing to history (preserves undo stack). */
    hydrate(state, action: PayloadAction<GanttSnapshot>) {
      state.present = action.payload;
      // Don't clear past/future — save/refetch must not wipe undo/redo
    },

    /** Reset everything (e.g. when switching projects). */
    reset() {
      return initialState;
    },

    /** Push current present to past, set new present. Clears future (new branch). */
    commit(state, action: PayloadAction<GanttSnapshot>) {
      state.past.push(state.present);
      if (state.past.length > MAX_HISTORY) state.past.shift();
      state.present = action.payload;
      state.future = [];
    },

    /** Update present in-place without pushing history (e.g. ID replacement after insert). */
    patch(state, action: PayloadAction<Partial<GanttSnapshot>>) {
      if (action.payload.tasks) state.present.tasks = action.payload.tasks;
      if (action.payload.links) state.present.links = action.payload.links;
    },

    undo(state) {
      if (state.past.length === 0) return;
      state.future.unshift(state.present);
      state.present = state.past.pop()!;
    },

    redo(state) {
      if (state.future.length === 0) return;
      state.past.push(state.present);
      state.present = state.future.shift()!;
    },
  },
});

export const { hydrate, reset, commit, patch, undo, redo } = ganttSlice.actions;
export default ganttSlice.reducer;
