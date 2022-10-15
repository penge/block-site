const __removeProtocol = (url: string) => url.replace(/^http(s?):\/\//, "");
const __removeWww = (url: string) => url.replace(/^www\./, "");
const __removeTrailingSlash = (url: string) => url.endsWith("/") ? url.slice(0, -1) : url;

export default (url: string): string => [url]
  .map(__removeProtocol)
  .map(__removeWww)
  .map(__removeTrailingSlash)
  .pop() as string;
