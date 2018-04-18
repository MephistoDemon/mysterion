// @flow

export interface HttpInterface {
  get(path: string, options: ?Object): any;

  post(path: string, data: mixed, options: ?Object): any;

  delete(path: string, options: ?Object): any;

  put(path: string, options: ?Object): any;
}
