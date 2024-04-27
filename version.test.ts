import packageJson from "./package.json";
import packageLockJson from "./package-lock.json";

import manifestChromeJson from "./public/manifest-chrome.json";
import manifestFirefoxJson from "./public/manifest-firefox.json";

test("version equality", () => {
  const { version } = packageJson;

  [
    packageLockJson.version,
    manifestChromeJson.version,
    manifestFirefoxJson.version,
  ].forEach((aVersion) => {
    expect(aVersion).toBe(version);
  });
});
