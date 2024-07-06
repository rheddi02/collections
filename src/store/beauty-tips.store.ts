import { createPaginationStore, type PaginationState } from './pagination.store';
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { beautyOutput } from "~/server/api/client/types";

interface State {
  data: beautyOutput[]
  setData: (data: State['data']) => void
}

const createStore: StateCreator<State & PaginationState, [], [], State> = (set) => ({
  data: [],
  setData: (data) => {
    set({ data })
  }
});

const useBeautyStore = create<State & PaginationState>()(
  subscribeWithSelector((...a) => ({
    ...createStore(...a),
    ...createPaginationStore(...a),
  })),
);

export default useBeautyStore;
