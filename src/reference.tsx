import React, { useRef, useState, useEffect } from 'react'
import './App.css'
import useScrollObserver from './hooks/useScrollObserver'
import AdapterDisplay from './commons/AdapterDisplay'
import useAdapterRender from './hooks/useAdapterRender'
const defaultData: any[] = []
const defaultDisplay: any[] = []
let count = -1
function App() {
  const container = useRef(null)
  const element = useRef(null)

  const [htmlElements, setHtmlElements] = useState({
    containerElement: container.current,
    observedElement: element.current
  })

  const [loading, setLoading] = useState(false)
  const [dataDisplay, setDataDisplay] = useState(defaultData)
  const [displayItems, setDisplayItems] = useState(defaultDisplay)

  useEffect(() => {
    if (container.current && element.current) {
      setHtmlElements({
        containerElement: container.current,
        observedElement: element.current
      })
    }
  }, [container, element])
  const { setElementContent, getElementContent } = useAdapterRender()

  const fetchData = async (
    reset: (reference: unknown) => void,
    reference: unknown
  ) => {
    setLoading(true)
    const dataJSON = await fetch(
      'http://dummy.restapiexample.com/api/v1/employees'
    )
    const data = await dataJSON.json()
    reset(reference)
    count += 1
    setElementContent(count, data.data)
    setDataDisplay(d => [...d, count])
    setLoading(false)
  }

  const {
    callbackReference,
    resetCallbackMethod
  } = useScrollObserver(
    htmlElements.containerElement,
    htmlElements.observedElement,
    () => fetchData(resetCallbackMethod, callbackReference)
  )
  const fetchRenderedItem = (callbackReference: number) => {
    const elements = getElementContent(callbackReference) || []
    setDisplayItems(elements)
  }

  return (
    <div id='container' ref={container} className='container'>
      <div className='scroller'>
        {dataDisplay?.map((data, index) => (
          <AdapterDisplay
            key={index}
            root={container.current}
            callback={fetchRenderedItem}
            selector={index}>
            {displayItems.map(dItems => {
              const values = Object.values(dItems)
              return (
                <div key={dItems.id} className='items'>
                  {values.map((v, index) => (
                    <div key={index}>{String(v)}</div>
                  ))}
                </div>
              )
            })}
          </AdapterDisplay>
        ))}
        <div ref={element} id='observed' className='observed'>
          {loading ? 'Loading ....' : '   '}
        </div>
      </div>
    </div>
  )
}

export default App
