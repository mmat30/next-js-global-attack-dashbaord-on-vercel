// Mock implementation of next/dynamic for testing
// Wraps components in React.Suspense without actual code splitting

import React from 'react'

type DynamicOptions = {
  loading?: () => React.ReactElement
  ssr?: boolean
}

type DynamicComponent<P = any> = React.ComponentType<P>

function dynamic<P = any>(
  loader: () => Promise<{ default: DynamicComponent<P> }>,
  options?: DynamicOptions
): DynamicComponent<P> {
  const Component = React.lazy(loader)

  const DynamicComponent = (props: P) => {
    const LoadingComponent = options?.loading

    return (
      <React.Suspense fallback={LoadingComponent ? <LoadingComponent /> : null}>
        <Component {...props} />
      </React.Suspense>
    )
  }

  return DynamicComponent as DynamicComponent<P>
}

export default dynamic
