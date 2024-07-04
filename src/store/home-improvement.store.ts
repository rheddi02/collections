import { createPaginationStore, type PaginationState } from './pagination.store';
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { GET } from "~/app/home-improvements/_actions/api";
import type { homeImprovementOutput } from "~/server/api/client/types";

interface State {
  fetch: () => Promise<void>
  data: homeImprovementOutput[]
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

const useHomeImprovementStore = create<State & PaginationState>()(
  subscribeWithSelector((...a) => ({
    ...createStore(...a),
    ...createPaginationStore(...a),
  })),
);

export default useHomeImprovementStore;
