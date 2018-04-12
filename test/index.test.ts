import { join } from "path";
import { setupRecorder } from "../src/index";
import * as nock from "nock";

describe("setupRecorder", () => {
  it("should set proper defaults", () => {
    setupRecorder();
    const nockBack: any = nock.back;
    expect(nockBack.fixtures).toBe(join(__dirname, "__nock-fixtures__"));
    expect(nockBack.currentMode).toBe("record");
  });

  it("should apply passed options", () => {
    setupRecorder({
      fixturePath: "/foo/bar",
      mode: "dryrun"
    });
    const nockBack: any = nock.back;
    expect(nockBack.fixtures).toBe("/foo/bar");
    expect(nockBack.currentMode).toBe("dryrun");
  });
});
