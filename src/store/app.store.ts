import { type PaginationState, createPaginationStore } from './pagination.store';
import _ from "lodash";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { CommonOutputType, formData } from "~/server/api/client/types";
import { ToastTypes } from '~/utils/types';

interface State {
  modal: boolean;
  isLoading: boolean
  isAuth: boolean
  actionable: boolean
  formData: formData
  formDataDefault: State['formData']
  toastType: ToastTypes
  setIsAuth: (isAuth: State['isAuth']) => void
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
  passcode: string
  setPasscode: (passcode: State['passcode']) => void
  passcodeModal: boolean
  deleteCodeModal: boolean
  deleteCode: boolean
  setDeleteCode: (deleteCode: State['deleteCode']) => void
  setPasscodeModal: (passcodeModal: State['passcodeModal']) => void
  setDeleteCodeModal: (deleteCodeModal: State['deleteCodeModal']) => void
}

const createStore: StateCreator<State, [], [], State> = (set, get) => ({
  data: [],
  modal: false,
  isAuth: false,
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
  passcodeModal: false,
  passcode: '',
  setIsAuth: (isAuth) => {
    set({ isAuth })
  },
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
    if (get().isAuth) set({ modal });
    else set({ modal: false })
  },
  setPasscodeModal: (passcodeModal) => {
    set({ passcodeModal })
  },
  setPasscode: (passcode) => {
    set({ passcode, isAuth: !!passcode.trim() })
  },
  deleteCode: false,
  setDeleteCode: (deleteCode) => {
    set({ deleteCode })
  },
  deleteCodeModal: false,
  setDeleteCodeModal: (deleteCodeModal) => {
    set({ deleteCodeModal })
  }
});

const useAppStore = create<State & PaginationState>()(
  subscribeWithSelector((...a) => ({
    ...createStore(...a),
    ...createPaginationStore(...a),
  })),
);

export default useAppStore;
