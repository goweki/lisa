const BASE_URL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

const INCLUDES_FORWARD_SLASH_AT_START_REGEX = /^\/(.|\n)*$/;
const INCLUDES_FORWARD_SLASH_AT_START = (string) =>
  INCLUDES_FORWARD_SLASH_AT_START_REGEX.test(string);

const getUrl = (path) =>
  `${BASE_URL}${!INCLUDES_FORWARD_SLASH_AT_START(path) ? "/" : ""}${path}`;

export default getUrl;
export {
  BASE_URL,
  INCLUDES_FORWARD_SLASH_AT_START_REGEX,
  INCLUDES_FORWARD_SLASH_AT_START,
};
