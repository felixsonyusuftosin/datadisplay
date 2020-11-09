import React, { useRef, useState, useEffect } from 'react'
import './AdapterDisplay.css'
import useScrollObserver from '../hooks/useScrollObserver'

type AdapterDisplayProps = {
  itemsLength?: number
  unitHeight?: number
  root: HTMLElement | null
  callback: (selector: number) => void
  selector: number
}
const AdapterDisplay: React.FC<AdapterDisplayProps> = ({
  children,
  itemsLength = 24,
  unitHeight = 50,
  root,
  selector,
  callback
}) => {
  const element = useRef(null)
  const [htmlElements, setHtmlElements] = useState({
    containerElement: root,
    observedElement: element.current
  })

  useEffect(() => {
    if (root && element.current) {
      setHtmlElements({
        containerElement: root,
        observedElement: element.current
      })
    }
  }, [root, element])

  const { callbackReference, resetCallbackMethod } = useScrollObserver(
    htmlElements.containerElement,
    htmlElements.observedElement,
    () => {
      callback(selector)
      resetCallbackMethod(callbackReference)
    }
  )

  const totalLength = itemsLength * unitHeight
  const containerHeight = { height: `${totalLength}px` }
  return (
    <div ref={element} className='adapter-container' style={containerHeight}>
      {children}
    </div>
  )
}

export default AdapterDisplay
