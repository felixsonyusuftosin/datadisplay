import React from 'react'
import 'intersection-observer'
import 'requestidlecallback'
import { render, screen } from '@testing-library/react'
import DataDisplay from './index';


describe('DataDisplay', () => {
  test('renders DataDisplay component', () => {
    render(<DataDisplay  />)
    //screen.debug()
  })
})


