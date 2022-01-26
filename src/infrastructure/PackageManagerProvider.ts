export default interface PackageManagerProvider {
  run(script: string, cwd: string): Promise<void>
  init(cwd: string): Promise<void>
  install(what: string, cwd: string, development?: boolean): Promise<void>
}
