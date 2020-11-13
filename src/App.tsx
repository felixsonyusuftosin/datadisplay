import React from 'react'
import DataDisplay from './components'
import { DataDisplayProvider } from './components/context/DataDisplay.context'

export const App = () => {

  return (
    <DataDisplayProvider>
      <DataDisplay />
    </DataDisplayProvider>
  )
}

export default App
