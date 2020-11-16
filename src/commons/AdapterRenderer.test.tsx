import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import 'intersection-observer'
import 'requestidlecallback'
import AdapterRenderer from './AdapterRenderer'
import AppLoader from '../components/dataDisplay/body/AppLoader';
import { TransactionItem } from '../types'

const server = setupServer(
  rest.get('/test', (req, res, ctx) => {
    return res(ctx.json(data))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const callback = async (url: string): Promise<TransactionItem[]> => {
  const dataResponse = await fetch(url)
  const data = await dataResponse.json()
  return data
}

const pagination = {
  currentPage: 1,
  nextPage: 2,
  totalPages: 10,
  limit: 24,
}

const rendererStyles = {
  unitHeightOfRow: 50,
  totalLengthOfItems: 24
}

const LoaderElement = () => <div>Loading...</div>
const Row = ({ ...props }: any) => {
  const itemKeys = [
    'id',
    'employee_name',
    'employee_salary',
    'employee_age',
    'profile_image'
  ]
  return (
    <div>
      {itemKeys.map((key: string, index: number) => {
        return (
        <span key={index}>{props[key]}</span>
      )})}
    </div>
  )
}

const adapterRendererProps = {
  callback,
  pagination,
  styles: rendererStyles,
  LoaderElement,
  Row,
  rowProps: {},
  parameters: '/test',
  AppLoader,
  resetPaginationData: () => null
}

describe('AdapterRenderer', () => {
  test('renders Adapter Renderer Component', async () => {
    render(<AdapterRenderer {...adapterRendererProps} />)
    const scrollContainer = document.getElementById('container') as Node
    fireEvent.scroll(scrollContainer, { target: { scrollY: '100%' } })
    await waitFor(() =>
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    )
    await waitFor(() =>
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    )
    await  waitFor(()=> expect(screen.queryAllByRole('presentation')[0]).toBeInTheDocument())
    await  waitFor( () => expect(screen.getAllByText(data[0].employee_name)[0]).toBeInTheDocument())
  })
})

export const data = [
  {
    id: '1',
    employee_name: 'Tiger Nixon',
    employee_salary: '320800',
    employee_age: '61',
    profile_image: ''
  },
  {
    id: '2',
    employee_name: 'Garrett Winters',
    employee_salary: '170750',
    employee_age: '63',
    profile_image: ''
  },
  {
    id: '3',
    employee_name: 'Ashton Cox',
    employee_salary: '86000',
    employee_age: '66',
    profile_image: ''
  },
  {
    id: '4',
    employee_name: 'Cedric Kelly',
    employee_salary: '433060',
    employee_age: '22',
    profile_image: ''
  },
  {
    id: '5',
    employee_name: 'Airi Satou',
    employee_salary: '162700',
    employee_age: '33',
    profile_image: ''
  },
]
