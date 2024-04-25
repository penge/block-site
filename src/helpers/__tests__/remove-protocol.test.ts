import removeProtocol from "../remove-protocol";

describe("removeProtocol()", () => {
  it("removes https, http", () => {
    expect(removeProtocol("https://example.com/")).toBe("example.com/");
    expect(removeProtocol("http://example.com/")).toBe("example.com/");

    expect(removeProtocol("https://www.example.com/")).toBe("www.example.com/");
    expect(removeProtocol("http://www.example.com/")).toBe("www.example.com/");

    expect(removeProtocol("https://dashboard.example.com/")).toBe("dashboard.example.com/");
    expect(removeProtocol("http://dashboard.example.com/")).toBe("dashboard.example.com/");

    expect(removeProtocol("https://www.dashboard.example.com/")).toBe("www.dashboard.example.com/");
    expect(removeProtocol("http://www.dashboard.example.com/")).toBe("www.dashboard.example.com/");
  });

  it("keeps path unchanged", () => {
    expect(removeProtocol("https://www.example.com/apple/projects/1?tab=analytics#charts")).toBe(
      "www.example.com/apple/projects/1?tab=analytics#charts",
    );

    expect(removeProtocol("https://example.com/apple/projects/1?tab=analytics#charts")).toBe(
      "example.com/apple/projects/1?tab=analytics#charts",
    );

    expect(removeProtocol("https://example.com/apple/projects/1")).toBe(
      "example.com/apple/projects/1",
    );

    expect(removeProtocol("https://example.com/apple/projects/")).toBe(
      "example.com/apple/projects/",
    );
  });
});
