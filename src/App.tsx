import React from 'react'
import  DataDisplay  from './components'
import Test from './test'


export const App = () => {
  const findStuff = async () => {
    const v = await Test()
    console.log(v)
  }
  findStuff()

  return <DataDisplay />
}

export default App