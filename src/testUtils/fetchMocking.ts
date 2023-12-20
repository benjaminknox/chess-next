import { Method } from '@api/common/Method'

export interface FetchMock {
  path: string
  method: Method
  delay?: number
  error?: boolean
  status?: number
  inputData?: any
  responseData?: any
  headers?: any
}

interface MockLookup {
  [k: string]: FetchMock
}

export function fetchMocking(...mocks: FetchMock[]): jest.MockedFunction<any> {
  return setupFetchMocks(mocks)
}

export const mockFake = async (
  path: RequestInfo,
  params: RequestInit | undefined,
  mockedArgs: MockLookup,
  mocks: FetchMock[]
) => {
  const { headers, ...args }: any = { path, ...params }

  const matchingMock = mockedArgs[JSON.stringify(args)]
  if (matchingMock) {
    const { delay, status, error, responseData } = matchingMock

    if (delay) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    if (error) {
      throw new Error('Request Failed')
    }

    return {
      status: status || 200,
      json: async () => responseData || {},
    } as Response
  } else {
    throwFetchMocks(mocks, args)

    return {} as Response
  }
}

function setupFetchMocks(mocks: FetchMock[], useJest = false): jest.MockedFunction<any> {
  const mockedArgs = mockLookupArgBuilder(mocks)
  jest
    .spyOn(window, 'fetch')
    .mockImplementation((path: RequestInfo, params?: RequestInit | undefined) =>
      mockFake(path, params, mockedArgs, mocks)
    )
}

export function mockLookupArgBuilder(mocks: Array<FetchMock>) {
  return mocks.reduce<MockLookup>((lookup, mock) => {
    let args: any = {
      path: mock.path,
      method: mock.method,
    }

    if (mock.inputData) {
      args = { ...args, body: JSON.stringify(mock.inputData) }
    }

    const key = JSON.stringify(args)

    lookup[key] = mock

    return lookup
  }, {})
}

export function throwFetchMocks(mocks: FetchMock[], args: any) {
  throw new Error(
    `No matching api mock\n\nExpected to find mock: ${JSON.stringify(
      args,
      null,
      2
    )}\n\nAll mocks: ${JSON.stringify(mocks, null, 2)}`
  )
}
