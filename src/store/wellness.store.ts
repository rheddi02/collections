import { createPaginationStore, type PaginationState } from './pagination.store';
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { GET } from "~/app/wellness/_actions/api";
import type { wellnessOutput } from "~/server/api/client/types";

interface State {
  fetch: () => Promise<void>
  data: wellnessOutput[]
  setData: (data: State['data']) => void
}

const createStore: StateCreator<State & PaginationState, [], [], State> = (set, get) => ({
  
  fetch: async () => {
    const res = await GET()
    set({ data: res })
  },
  data: [],
  setData: (data) => {
    set({ data })
  }
});

const useWellnessStore = create<State & PaginationState>()(
  subscribeWithSelector((...a) => ({
    ...createStore(...a),
    ...createPaginationStore(...a),
  })),
);

export default useWellnessStore;
