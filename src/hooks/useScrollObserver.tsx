import React, { useRef, useEffect } from 'react'

declare const requestIdleCallback: any
declare const cancelIdleCallback: any

type IntersectionObserverImplement = {
  (container: Element, element: Element, cb: IntersectionObserverCallback): void
}

type InterserctionObserverOptions = {
  root: Element | null
  rootMargin: string
  threshold: number | number[]
}

type UseScrollObserverCallback<T> = {
  (): T
}

type ScrollObserverOutputs = {
  callbackReference: unknown
  resetCallbackMethod: (id: unknown) => void
}

export const useScrollObserver = (
  container: HTMLElement | null,
  element: Element | null,
  callback: UseScrollObserverCallback<unknown>
): ScrollObserverOutputs => {

  const callbackReference = useRef(null)
  const indicatedEntry: IntersectionObserverCallback = React.useCallback(
    (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ): void => {
      element && observer.observe(element)
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          handleCallbackActionAsynchronously(callback)
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [element]
  )

  const IOObserver: IntersectionObserverImplement = (
    container: Element | null,
    element: Element,
    cb: IntersectionObserverCallback
  ): void => {
    const options: InterserctionObserverOptions = {
      root: container as HTMLElement,
      rootMargin: '0px',
      threshold: 0.1
    }
    const IO = new IntersectionObserver(cb, options)
    IO.observe(element)
  }

  const handleCallbackActionAsynchronously = (
    cb: UseScrollObserverCallback<unknown>
  ): unknown | null => {
    const timeout = 1000
    const options = { timeout }
    if (!callbackReference.current) {
      const id = requestIdleCallback(cb, options)
      callbackReference.current = id
      return id
    }
    return null
  }

  const resetCallbackMethod = (id: unknown): void => {
    id && cancelIdleCallback(id)
    callbackReference.current = null
  }

  useEffect((): void => {
    if (element && container) {
      element && IOObserver(container, element, indicatedEntry)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, element])

  return { callbackReference: callbackReference.current, resetCallbackMethod }
}

export default useScrollObserver
