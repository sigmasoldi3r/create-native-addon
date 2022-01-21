import { Service } from 'typedi'

/**
 * A service that takes care of centralizing string
 * manipulation related to sanitizing names.
 */
@Service()
export default class NameSanitizer {
  /**
   * Returns the string to kebab-case.
   */
  toKebab(source: string): string {
    return source.replace(/ |_/g, '-').toLowerCase()
  }
}
