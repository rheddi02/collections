import { type PaginationState, createPaginationStore } from './pagination.store';
import _ from "lodash";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { categoryOutput } from "~/server/api/client/types";
import { ToastTypes } from '~/utils/types';

export interface State {
  filters: {
    search: string
  }
  categories: categoryOutput[]
  setCategories: (categories: State['categories']) => void
  setFilters: (filters: State['filters']) => void
  isMe: boolean,
  setIsMe: (isMe: State['isMe']) => void
  modal: boolean;
  isLoading: boolean
  actionable: boolean
  toastType: {
    type:ToastTypes
    data?: string
  }
  setToastType: (toastType: State['toastType']) => void
  setIsLoading: (isLoading: boolean) => void
  setActionable: (actionable: boolean) => void
  setModal: (modal: State["modal"]) => void;
  openMenu: boolean
  setOpenMenu: (openMenu: State['openMenu']) => void
  deleteId: number[]
  setDeleteId: (deleteId:number) => void
  isFetching: boolean
  setIsFetching: (isFetching: State['isFetching']) => void
  credentialsModal: boolean
  setCredentialsModal: (credentialsModal: State['credentialsModal']) => void
}

const createStore: StateCreator<State, [], [], State> = (set, get) => ({
  categories: [],
  setCategories: (categories) => {
    set({ categories })
  },
  filters: {
    search: '',
  },
  setFilters: (filters) => {
    set({ filters })
  },
  modal: false,
  openMenu: true,
  isLoading: false,
  actionable: false,
  toastType: {
    type: ToastTypes.DEFAULT,
    data: ''
  },
  deleteId: [],
  setDeleteId: (deleteId) => {
    set({ deleteId: [...get().deleteId, deleteId] })
  },
  setToastType: (toastType) => {
    set({ toastType })
  },
  setOpenMenu: (openMenu: State['openMenu']) => {
    set({ openMenu })
  },
  setActionable: (actionable: boolean) => {
    set({ actionable })
  },
  setIsLoading: (isLoading) => {
    if (isLoading) set({ actionable: false})
    set({ isLoading })
  },
  setModal: (modal) => {
    set({ modal });
  },
  isFetching: false,
  setIsFetching: (isFetching) => {
    set({ isFetching })
  },
  isMe: false,
  setIsMe: (isMe) => {
    set({ isMe })
  },
  credentialsModal: false,
  setCredentialsModal: (credentialsModal) => {
    set({ credentialsModal })
  }
});

const useAppStore = create<State & PaginationState>()(
  subscribeWithSelector((...a) => ({
    ...createStore(...a),
    ...createPaginationStore(...a),
  })),
);

export default useAppStore;
