import "dotenv/config";

const API_HOST = process.env.API_HOST;

function urlGenerator(apiKey: string, endpoint: string) {
  const url = API_HOST + `/api/mock/${apiKey}${endpoint}`;
  return url;
}

export default urlGenerator;
