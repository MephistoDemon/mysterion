// @flow

import type {HeaderRule} from './requestHeaders'

export interface RequestRewriter {
  registerRequestHeadersRule (HeaderRule): void
}
