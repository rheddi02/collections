// Mock tRPC API
export const createMockTRPC = () => {
  const mockCreate = {
    category: {
      useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        mutateAsync: jest.fn(),
        isPending: false,
        isError: false,
        error: null,
      })),
    },
  }

  const mockList = {
    categories: {
      useQuery: jest.fn(() => ({
        data: {
          data: [
            { id: 1, title: 'test-category', createdAt: new Date(), updatedAt: new Date() },
          ],
          totalPages: 1,
          currentPage: 1,
          totalCount: 1,
        },
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: jest.fn(),
      })),
      invalidate: jest.fn(),
    },
  }

  const mockUtils = {
    list: mockList,
    useUtils: jest.fn(() => ({
      list: {
        categories: {
          invalidate: jest.fn(),
          fetch: jest.fn(),
        },
      },
    })),
  }

  return {
    create: mockCreate,
    list: mockList,
    useUtils: jest.fn(() => mockUtils),
  }
}

// Mock the api object
export const mockApi = createMockTRPC()

// Mock the toast function
export const mockToast = jest.fn()

// Mock the form hooks
export const mockUseForm = () => ({
  register: jest.fn(),
  handleSubmit: jest.fn((fn) => (e: Event) => {
    e.preventDefault()
    fn({ title: 'test-category' })
  }),
  formState: { errors: {} },
  watch: jest.fn(() => 'test-category'),
  reset: jest.fn(),
  setValue: jest.fn(),
})

// Mock app store
export const mockUseAppStore = jest.fn(() => ({
  page: 1,
  perPage: 10,
  pageCount: 1,
  setPageCount: jest.fn(),
  editCategory: null,
  setEditCategory: jest.fn(),
  deleteId: [],
  setDeleteId: jest.fn(),
  removeDeleteId: jest.fn(),
  modal: false,
  setModal: jest.fn(),
  openMenu: false,
  setOpenMenu: jest.fn(),
}))
