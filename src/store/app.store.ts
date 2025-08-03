import { type PaginationState, createPaginationStore } from './pagination.store';
import _ from "lodash";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { CommonOutputType, formData, linkOutput } from "~/server/api/client/types";
import { ToastTypes } from '~/utils/types';

export interface State {
  filters: {
    search: string
  }
  categories: linkOutput[]
  setCategories: (categories: State['categories']) => void
  setFilters: (filters: State['filters']) => void
  isMe: boolean,
  setIsMe: (isMe: State['isMe']) => void
  modal: boolean;
  isLoading: boolean
  actionable: boolean
  formData: formData
  formDataDefault: State['formData']
  toastType: ToastTypes
  setToastType: (toastType: State['toastType']) => void
  setFormData: (formData: State['formData']) => void
  resetForm: () => void
  setIsLoading: (isLoading: boolean) => void
  setActionable: (actionable: boolean) => void
  setModal: (modal: State["modal"]) => void;
  openMenu: boolean
  setOpenMenu: (openMenu: State['openMenu']) => void
  data: CommonOutputType[]
  setData: (data: State['data']) => void
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
  data: [],
  modal: false,
  openMenu: true,
  isLoading: false,
  actionable: false,
  formDataDefault: {
    title: '',
    description: '',
    url: '',
    type: ''
  },
  formData: {
    title: '',
    description: '',
    url: '',
    type: ''
  },
  toastType: ToastTypes.DEFAULT,
  deleteId: [],
  setDeleteId: (deleteId) => {
    set({ deleteId: [...get().deleteId, deleteId] })
  },
  setData: (data) => {
    set({ toastType: ToastTypes.DEFAULT })
    set({ data })
  },
  setToastType: (toastType) => {
    set({ toastType })
  },
  setOpenMenu: (openMenu: State['openMenu']) => {
    set({ openMenu })
  },
  resetForm: () => {
    set({ formData: _.cloneDeep(get().formDataDefault) })
  },
  setFormData: (formData) => {
    if (formData.title.trim()) set({ actionable: true })
    set({ formData })
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
