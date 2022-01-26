import Container, { Service } from 'typedi'
import { none, option, some } from '@octantis/option'
import FileWriter, {
  AbstractSerializer,
} from '../infrastructure/FileSerializer'
import FileSerializer from '../infrastructure/FileSerializer'

/**
 * Marks the class as a serialization type, with the given
 * name tag.
 */
export function Serializer(alias: string) {
  return (Target: { new (): any }) => {
    Container.get(FileSerializerProvider).add(alias, new Target())
  }
}

/**
 * File writer provider service.
 */
@Service()
export default class FileSerializerProvider {
  private readonly store = new Map<string, AbstractSerializer>()

  add(what: string, writer: AbstractSerializer) {
    this.store.set(what, writer)
  }

  get(what: string): option<AbstractSerializer> {
    if (this.store.has(what)) {
      return some(this.store.get(what))
    }
    return none()
  }

  getFileSerializer(what: string) {
    return this.get(what).map(s => new FileSerializer(s))
  }
}
