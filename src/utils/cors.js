export function withCorsHeaders(headers = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
    ...headers,
  };
}

export function handleOptionsCors() {
  return new Response(null, {
    status: 204,
    headers: withCorsHeaders(),
  });
}

export function checkAndroidApiKey(request) {
  const key = request.headers.get("x-api-key");
  return key && key === process.env.ANDROID_API_KEY;
}
// // penggunaan pada route
// if (!checkAndroidApiKey(request)) {
//   return new Response(
//     JSON.stringify({ message: "Unauthorized - API Key tidak valid" }),
//     {
//       status: 401,
//       headers: withCorsHeaders(),
//     }
//   );
// }
