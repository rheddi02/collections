import { createPaginationStore, type PaginationState } from './pagination.store';
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { homeImprovementOutput } from "~/server/api/client/types";

interface State {
  data: homeImprovementOutput[]
  setData: (data: State['data']) => void
}

const createStore: StateCreator<State & PaginationState, [], [], State> = (set, get) => ({
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
