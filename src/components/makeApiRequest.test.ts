import axios from 'axios'
import { makeRestApiCall } from './makeApiRequest'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MakeApiRequest', () => {
  it('fetches successfully data from an API', async () => {
    const data = {
      status: 200,
      data: {
        hits: [
          {
            objectID: '1',
            title: 'a',
          },
          {
            objectID: '2',
            title: 'b',
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValue(data);
    const response = await makeRestApiCall('/test')
    expect(mockedAxios).toHaveBeenCalled()
    // expect(mockedAxios).toHaveBeenCalledWith(
    //   `${process.env.BASE_URL}/test`,
    // );
    expect(response).toEqual(data.data);

  });
});
//   it('fetches erroneously data from an API', async () => {
//     const errorMessage = 'Network Error';
//     (axios as jest.Mocked<typeof axios>).get.mockImplementationOnce(() =>
//       Promise.reject(new Error(errorMessage)));
//     await expect(makeRestApiCall('/test')).rejects.toThrow(errorMessage);
//   });
// });

