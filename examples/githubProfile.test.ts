import { getGithubProfile } from "./githubProfile";
import { setupRecorder } from "../lib/index";

const record = setupRecorder();

describe("#getGithubProfile", () => {
  it("should retrieve user info", async () => {
    const { completeRecording, assertScopesFinished } = await record(
      "github-edorivai"
    );
    const result = await getGithubProfile("edorivai");

    completeRecording();
    assertScopesFinished();

    expect(result).toMatchSnapshot();
  });
});
