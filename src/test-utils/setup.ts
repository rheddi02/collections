import '@testing-library/jest-dom'
import React from 'react'
import { TextEncoder, TextDecoder } from 'util'

// Polyfill for Node.js environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    reload: jest.fn(),
    query: {},
    pathname: '/',
    route: '/',
    asPath: '/',
  }),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        isVerified: true,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    status: 'authenticated',
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
}))

// Mock UI components
jest.mock('~/components/ui/form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => React.createElement('div', { 'data-testid': 'form-provider' }, children),
  FormItem: ({ children }: { children: React.ReactNode }) => React.createElement('div', {}, children),
  FormLabel: ({ children }: { children: React.ReactNode }) => React.createElement('label', {}, children),
  FormControl: ({ children }: { children: React.ReactNode }) => React.createElement('div', {}, children),
  FormDescription: ({ children }: { children: React.ReactNode }) => React.createElement('div', {}, children),
  FormMessage: ({ children }: { children: React.ReactNode }) => React.createElement('div', {}, children),
}))

jest.mock('~/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => React.createElement('div', {}, children),
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => React.createElement('div', {}, children),
  PopoverContent: ({ children }: { children: React.ReactNode }) => React.createElement('div', {}, children),
}))

jest.mock('~/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => 
    React.createElement('button', { onClick, ...props }, children),
}))

jest.mock('~/components/ui/input', () => ({
  Input: (props: any) => React.createElement('input', props),
}))

// Mock custom components that might not be available
jest.mock('~/app/admin/_components/text-input', () => ({
  TextInput: ({ name, ...props }: any) => 
    React.createElement('input', { 'data-testid': `input-${name}`, name, ...props }),
}))

// Mock tRPC
jest.mock('~/trpc/react', () => ({
  api: {
    create: {
      category: {
        useMutation: jest.fn(() => ({
          mutate: jest.fn(),
          mutateAsync: jest.fn(),
          isPending: false,
          isError: false,
          error: null,
        })),
      },
    },
    useUtils: jest.fn(() => ({
      list: {
        categories: {
          invalidate: jest.fn(),
        },
      },
    })),
  },
}))

// Mock useApiUtils hook
jest.mock('~/hooks', () => ({
  useApiUtils: () => ({
    list: {
      categories: {
        invalidate: jest.fn(),
      },
    },
  }),
}))

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: jest.fn((fn) => (e: any) => {
      e?.preventDefault?.()
      fn({ title: 'test-category' })
    }),
    formState: { errors: {} },
    watch: jest.fn(() => 'test-category'),
    reset: jest.fn(),
    setValue: jest.fn(),
    control: {},
  }),
  Controller: ({ render }: { render: any }) => render({ field: {}, fieldState: {}, formState: {} }),
  useFormContext: () => ({
    register: jest.fn(),
    formState: { errors: {} },
    control: {},
  }),
}))

// Mock toast
jest.mock('~/components/ui/use-toast', () => ({
  toast: jest.fn(),
}))
