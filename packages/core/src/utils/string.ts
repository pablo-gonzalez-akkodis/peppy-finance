export function titleCase(str: string) {
  return str
    .toLowerCase()
    .replace("_", " ")
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function log(message: unknown): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[DEV]", message);
  } else if (process.env.NODE_ENV === "test") {
    console.log("[TEST]", message);
  }
}
