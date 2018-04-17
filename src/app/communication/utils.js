// @flow
function waitForMessage (subscriber: (() => void) => void): Promise<void> {
  return new Promise((resolve) => {
    subscriber(() => {
      resolve()
    })
  })
}

export { waitForMessage }
