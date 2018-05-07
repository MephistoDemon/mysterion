// @flow

type HttpQueryParams = {
  [string]: mixed
}

interface HttpInterface {
  get (path: string, query: ?HttpQueryParams, timeout: ?number): Promise<?mixed>;
  post (path: string, data: mixed, timeout: ?number): Promise<?mixed>;
  delete (path: string, timeout: ?number): Promise<?mixed>;
  put (path: string, timeout: ?number): Promise<?mixed>;
}

export type {HttpInterface, HttpQueryParams}
