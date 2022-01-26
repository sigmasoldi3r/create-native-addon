import { readFileSync, writeFileSync } from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'
import { Inject, Service } from 'typedi'
import FileSerializer from '../infrastructure/FileSerializer'
import FileSerializerProvider from './FileSerializerProvider'
import '../infrastructure/CsonSerializer'
import '../infrastructure/JsonSerializer'

/**
 * A file manager that is bound to a root file.
 */
export class BoundFileManager {
  constructor(
    private readonly root: string,
    private readonly jsonWriter: FileSerializer,
    private readonly csonWriter: FileSerializer
  ) {}

  dir(dir: string) {
    mkdirp.sync(path.join(this.root, dir))
  }

  write(to: string, contents: string | Buffer) {
    writeFileSync(path.join(this.root, to), contents)
  }

  read(from: string) {
    return readFileSync(path.join(this.root, from))
  }

  json = {
    write: (to: string, object: any) =>
      this.jsonWriter.write(path.join(this.root, to), object),
    read: (from: string) => this.jsonWriter.read(path.join(this.root, from)),
  }

  cson = {
    write: (to: string, object: any) =>
      this.csonWriter.write(path.join(this.root, to), object),
    read: (from: string) => this.csonWriter.read(path.join(this.root, from)),
  }
}

/**
 * A file manager binder service.
 */
@Service()
export default class FileManager {
  constructor(@Inject() private readonly provider: FileSerializerProvider) {
    this.json = provider.getFileSerializer('json').get()
    this.cson = provider.getFileSerializer('cson').get()
  }
  readonly json: FileSerializer
  readonly cson: FileSerializer

  bound(root: string) {
    return new BoundFileManager(root, this.json, this.cson)
  }
}
