declare module '@tanstack/react-query-devtools' {
  import type { ComponentType } from 'react'

  export interface ReactQueryDevtoolsProps {
    initialIsOpen?: boolean
    buttonPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  }

  export const ReactQueryDevtools: ComponentType<ReactQueryDevtoolsProps>
}
