import type { StateCreator } from 'zustand';

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
  perPage: 15,

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