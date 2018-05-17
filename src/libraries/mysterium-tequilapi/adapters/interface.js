// @flow

type HttpQueryParams = {
  [string]: mixed
}

interface HttpInterface {
  get (path: string, query: ?HttpQueryParams, timeout: ?number): Promise<?any>;
  post (path: string, data: mixed, timeout: ?number): Promise<?any>;
  delete (path: string, timeout: ?number): Promise<?any>;
  put (path: string, data: mixed, timeout: ?number): Promise<?any>;
}

export type {HttpInterface, HttpQueryParams}
