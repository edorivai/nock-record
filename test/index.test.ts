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

describe("record", () => {
  const originalBack = nock.back;
  const mockContext = {
    assertScopesFinished: () => {}
  };

  afterEach(() => ((nock as any).back = originalBack));
  it("should call nock.back", async () => {
    const nockDone = () => {};
    const nockOptions = {};
    const backMock = jest.fn().mockReturnValueOnce(
      Promise.resolve({
        nockDone,
        context: mockContext
      })
    );
    (backMock as any).setMode = jest.fn();
    (nock as any).back = backMock;

    const record = setupRecorder();
    const res = await record("my-fixture", nockOptions);
    expect(res.completeRecording).toBe(nockDone);
    expect(backMock).toBeCalledWith("my-fixture.json", nockOptions);
  });
});
