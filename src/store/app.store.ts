import { type PaginationState, createPaginationStore } from './pagination.store';
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { categoryAllOutput } from '~/server/api/client/types';
import { FilterFormValues, UpdateCategoryValues } from '~/utils/schemas';
import { ToastTypes } from '~/utils/types';

// UI State interfaces
interface UIState {
  modal: boolean;
  openMenu: boolean;
  isLoading: boolean;
  confirmDialog: {
    isOpen: boolean;
    title: string;
    description: string;
    warningText?: string;
    confirmText: string;
    cancelText: string;
    variant: 'default' | 'destructive';
    isLoading: boolean;
    onConfirm: () => void | Promise<void>;
  } | null;
}

interface UIActions {
  setModal: (modal: boolean) => void;
  setOpenMenu: (openMenu: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setConfirmDialog: (dialog: UIState['confirmDialog']) => void;
  closeConfirmDialog: () => void;
}

// Data State interfaces
interface DataState {
  categories: categoryAllOutput;
  editCategory: UpdateCategoryValues | null;
  deleteId: number[];
  filters: FilterFormValues
}

interface DataActions {
  setCategories: (categories: categoryAllOutput) => void;
  setEditCategory: (editCategory: UpdateCategoryValues | null) => void;
  setDeleteId: (deleteId: number | number[]) => void;
  // Utility methods
  resetDeleteIds: () => void;
  setFilters: (filters: FilterFormValues) => void;
}

// UI Actions interfaces  
interface UtilityActions {
  toggleModal: () => void;
  toggleMenu: () => void;
}

// Toast State interfaces
interface ToastState {
  toastType: {
    type: ToastTypes;
    data?: string;
  };
}

interface ToastActions {
  setToastType: (toastType: ToastState['toastType']) => void;
}

// Combined State interface
export interface State extends UIState, DataState, ToastState, UIActions, DataActions, ToastActions, UtilityActions {}

const createStore: StateCreator<State, [], [], State> = (set, get) => ({
  // UI State
  modal: false,
  openMenu: true,
  isLoading: false,
  confirmDialog: null,
  // Data State
  categories: [],
  editCategory: null,
  deleteId: [],
  // Toast State
  toastType: {
    type: ToastTypes.DEFAULT,
    data: ''
  },
  filters: {
    keyword: ''
  },
  // UI Actions
  setModal: (modal) => set({ modal }),
  setOpenMenu: (openMenu) => set({ openMenu }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setConfirmDialog: (confirmDialog) => {
    if (confirmDialog && typeof confirmDialog.onConfirm === 'function') {
      set({ confirmDialog });
    } else {
      console.warn('Invalid confirmDialog configuration');
    }
  },
  closeConfirmDialog: () => set({ confirmDialog: null }),
  // Data Actions
  setCategories: (categories) => set({ categories }),
  setEditCategory: (editCategory) => set({ editCategory }),
  setDeleteId: (deleteId) => set({ deleteId: deleteId instanceof Array ? deleteId : [deleteId] }),
  setFilters: (filters) => set({ filters }),
  // Toast Actions
  setToastType: (toastType) => set({ toastType }),
  // Utility methods for common operations
  resetDeleteIds: () => set({ deleteId: [] }),
  toggleModal: () => set({ modal: !get().modal }),
  toggleMenu: () => set({ openMenu: !get().openMenu }),
});

const useAppStore = create<State & PaginationState>()(
  subscribeWithSelector((...a) => ({
    ...createStore(...a),
    ...createPaginationStore(...a),
  })),
);

export default useAppStore;
