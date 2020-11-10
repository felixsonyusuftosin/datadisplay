import React from 'react'
import 'intersection-observer'
import 'requestidlecallback'
import { render } from '@testing-library/react'
import  AdapterDisplay, { AdapterDisplayProps} from './AdapterDisplay';


const props: AdapterDisplayProps = {
  itemsLength: 24,
  unitHeight: 50,
  root:null,
  callback: () => console.log('callback fired'),
  selector: 1
}
describe('AdapterDisplay', () => {
  test('renders Adapter Component', () => {
    render(<AdapterDisplay {...props} />)
  })
})


