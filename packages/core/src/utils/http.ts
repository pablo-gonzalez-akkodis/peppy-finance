export const makeHttpRequest = async function (
  url: string,
  options: {
    [x: string]: any;
  } = {
    cache: "no-cache",
  }
) {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(response.statusText);
    }
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw err;
    } else {
      console.error(`Error fetching ${url}: `, err);
    }
    return null;
  }
};
