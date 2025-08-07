import type { StateCreator } from 'zustand';
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { PAGE_LIMIT } from '~/utils/contants/page-limit';

export interface PaginationState {
  page: number;
  perPage: number;
  pageCount: number;
  setPage: (page: PaginationState['page']) => void;
  setPerPage: (perPage: PaginationState['perPage']) => void;
  setPageCount: (pageCount: PaginationState['pageCount']) => void
}

export const createPaginationStore: StateCreator<PaginationState & any, [], [], PaginationState> = (set) => ({
  /**
   * current page
   */
  page: 1,

  /**
   * total count of data
   */
  pageCount: 0,

  /**
   * per page limit
   */
  perPage: PAGE_LIMIT,

  /**
   * set current page
   * @param page
   */
  setPage: (page: number) => {
    set({ page })
  },

  /**
   * set per page limit
   * @param perPage
   */
  setPerPage: (perPage: number) => {
    set({ perPage })
  },
  /**
   * set per page limit
   * @param pageCount
   */
  setPageCount: (pageCount) => {
    set({ pageCount })
  }
})

const usePaginationStore = create<PaginationState>()(
  subscribeWithSelector((...a) => ({
    ...createPaginationStore(...a),
  })),
);

export default usePaginationStore;