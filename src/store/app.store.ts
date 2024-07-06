import _ from "lodash";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { formData } from "~/server/api/client/types";

interface State {
  modal: boolean;
  isLoading: boolean
  actionable: boolean
  formData: formData
  formDataDefault: State['formData']
  toastData: {title: string, description?: string}
  setToastData: (toastData: State['toastData']) => void
  setFormData: (formData: State['formData']) => void
  resetForm: () => void
  setIsLoading: (isLoading: boolean) => void
  setActionable: (actionable: boolean) => void
  setModal: (modal: State["modal"]) => void;
  openMenu: boolean
  setOpenMenu: (openMenu: State['openMenu']) => void
}

const createStore: StateCreator<State, [], [], State> = (set, get) => ({
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
  toastData: { title: '', description: ''},
  setToastData: (toastData) => {
    set({ toastData })
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

const useAppStore = create<State>()(
  subscribeWithSelector((...a) => ({
    ...createStore(...a),
  })),
);

export default useAppStore;
