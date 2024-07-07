import { type PaginationState, createPaginationStore } from './pagination.store';
import _ from "lodash";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { CommonOutputType, formData } from "~/server/api/client/types";

interface State {
  modal: boolean;
  isLoading: boolean
  actionable: boolean
  formData: formData
  formDataDefault: State['formData']
  toastType: string
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
  deleteId: number
  setDeleteId: (deleteId: State['deleteId']) => void
}

const createStore: StateCreator<State, [], [], State> = (set, get) => ({
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
  toastType: '',
  deleteId: 0,
  setDeleteId: (deleteId) => {
    set({ deleteId })
  },
  setData: (data) => {
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
});

const useAppStore = create<State & PaginationState>()(
  subscribeWithSelector((...a) => ({
    ...createStore(...a),
    ...createPaginationStore(...a),
  })),
);

export default useAppStore;
