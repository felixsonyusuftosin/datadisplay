import React, { useRef, useState, useEffect } from 'react'
import './App.css'
import useScrollObserver from './hooks/useScrollObserver'

function App() {
  const container = useRef(null)
  const element = useRef(null)

  const [htmlElements, setHtmlElements] = useState({
    containerElement: container.current,
    observedElement: element.current
  })

  useEffect(() => {
    if (container.current && element.current) {
      setHtmlElements({
        containerElement: container.current,
        observedElement: element.current
      })
    }
  }, [container, element])
  
  const [color, setColor] = useState({ border: 'black', background: 'blue' })
  const { callbackReference, resetCallbackMethod } = useScrollObserver(
    htmlElements.containerElement,
    htmlElements.observedElement,
    () =>
      setColor(c => {
        console.log('is it running')
        resetCallbackMethod(callbackReference)
        return { ...c, border: 'red', background: 'yellow' }
      })
  )

  const { border, background } = color
  return (
    <div
      id='container'
      ref={container}
      style={{ borderColor: border }}
      className='container'>
      <div className='scroller'>
        <div
          ref={element}
          style={{ background }}
          id='observed'
          className='observed'
        />
      </div>
    </div>
  )
}

export default App
