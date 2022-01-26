export interface IndexJsParams {
  namespace: string
}

export default function IndexJs({ namespace }: IndexJsParams) {
  return `const { add } = require('./build/Release/${namespace}.node')

// Native hello world
console.log('add 2 + 3 =', add(2, 3))
`
}
