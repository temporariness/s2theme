const SOURCE_URL =
  "https://gh-proxy.org/https://github.com/temporariness/s2theme/blob/main/s2theme.json";

$httpClient.get(
  {
    url: SOURCE_URL,
    headers: {
      Accept: "application/json, text/plain;q=0.9, */*;q=0.8",
      "User-Agent": "Stash",
    },
    timeout: 8,
    "auto-redirect": true,
  },
  (error, response, data) => {
    if (error) {
      return fallback(`download failed: ${error}`);
    }

    const status = Number(
      response && (response.status || response.statusCode || 0),
    );
    if (status && (status < 200 || status >= 300)) {
      return fallback(`source returned HTTP ${status}`);
    }

    const body = typeof data === "string" ? data : JSON.stringify(data);
    try {
      JSON.parse(body);
    } catch (parseError) {
      return fallback(`source is not valid JSON: ${parseError.message}`);
    }

    $done({
      response: {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-cache",
        },
        body,
      },
    });
  },
);

function fallback(message) {
  console.log(`[s2theme-replace] ${message}; using the original response`);
  $done({});
}
