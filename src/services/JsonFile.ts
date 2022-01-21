import { readFileSync, writeFileSync } from 'fs'
import { Service } from 'typedi'

export interface JsonOptions {
  space?: number
  replacer?: (this: any, key: string, value: any) => any
}

export const DEFAULT_JSON_OPTIONS: JsonOptions = {
  space: 2,
  replacer: null,
}

export class BoundJsonFile {
  constructor(
    private readonly service: JsonFile,
    private readonly file: string
  ) {}

  update(mutator: (input: any) => void, options?: JsonOptions) {
    return this.service.update(this.file, mutator, options)
  }

  /**
   * Sets the given field denoted by a path segment (Use dot
   * access expression).
   *
   * @example set('my.custom.field', true)
   *
   * // Result
   * { my: { custom: { field: true } } }
   */
  set(field: string, value: any) {
    const segments = field.split(/\./)
    this.update(object => {
      let current = object
      while (segments.length) {
        const top = segments.shift()
        if (segments.length) {
          if (current[top] == null) {
            current[top] = {}
          }
          current = current[top]
        } else {
          current[top] = value
        }
      }
    })
  }
}

/**
 * JSON file marshalling and unmarshalling service.
 */
@Service()
export default class JsonFile {
  /**
   * Reads the JSON file.
   */
  read(from: string) {
    const data = readFileSync(from)
    return JSON.parse(data.toString())
  }

  /**
   * Writes the object as a JSON file.
   */
  write(to: string, object: any, options = DEFAULT_JSON_OPTIONS) {
    const plain = JSON.stringify(object, options.replacer, options.space)
    writeFileSync(to, plain)
  }

  /**
   * Updates the JSON file, applying the changes.
   */
  update(source: string, mutator: (input: any) => void, options?: JsonOptions) {
    const input = this.read(source)
    mutator(input)
    this.write(source, input, options)
  }

  bound(to: string) {
    return new BoundJsonFile(this, to)
  }
}
