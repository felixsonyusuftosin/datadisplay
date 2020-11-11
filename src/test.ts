import { makeRestApiCall } from './components/makeApiRequest'

const PROGRAM_ID='2314f371-39b1-4c80-8040-4144ff1bad09'

const retData = async () => {
  return await makeRestApiCall(`programs/${PROGRAM_ID}/transactions`)
}

export default retData