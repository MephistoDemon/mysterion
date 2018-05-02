// @flow

type HttpQueryParams = {
  [string]: mixed
}

interface HttpInterface {
  get (path: string, query: ?HttpQueryParams, options: ?Object): Promise<?mixed>
  post (path: string, data: mixed, options: ?Object): Promise<?mixed>
  delete (path: string, options: ?Object): Promise<?mixed>
  put (path: string, options: ?Object): Promise<?mixed>
}

export type {HttpInterface, HttpQueryParams}
