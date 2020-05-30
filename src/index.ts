import { dirname, join } from "path";
import * as nock from "nock";
import * as stackTrace from "stack-trace";

export interface Options {
  /** The directory where fixtures will be stored. Defaults to {test-directory}/__nock-fixtures__ */
  fixturePath?: string;
  /**
   * Nock Back Mode, defaults to 'record'
   * Nock docs: https://github.com/node-nock/nock#modes
   * - wild: all requests go out to the internet, don't replay anything, doesn't record anything
   * - dryrun: The default, use recorded nocks, allow http calls, doesn't record anything, useful
   *   for writing new tests
   * - record: use recorded nocks, record new nocks
   * - lockdown: use recorded nocks, disables all http calls even when not nocked, doesn't record
   **/
  mode?: nock.BackMode;
}

function parentPath() {
  const trace = stackTrace.get();
  const currentFile = trace.shift()!.getFileName();
  const parentFile = trace
    .find(t => t.getFileName() !== currentFile)!
    .getFileName();
  const path = dirname(parentFile);
  return path.replace(/^file:\/\//, '') // Remove file:// from protocol on linux
}

export function setupRecorder(options: Options = {}) {
  const nockBack: nock.Back = nock.back as any;
  const fixturePath =
    options.fixturePath || join(parentPath(), "__nock-fixtures__");

  nockBack.fixtures = fixturePath;
  nockBack.setMode(options.mode || "record");

  return (fixtureName: string, options: nock.BackOptions = {}) =>
    nockBack(`${fixtureName}.json`, options).then(({ nockDone, context }) => ({
      completeRecording: nockDone,
      ...context,
      assertScopesFinished: context.assertScopesFinished.bind(context)
    }));
}
