// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

const tsconfigPath = "./apps/nextjs/tsconfig.json"; // Update this with the actual path

fs.readFile(tsconfigPath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const tsconfig = JSON.parse(data);

  if (!tsconfig.compilerOptions) {
    tsconfig.compilerOptions = {};
  }

  if (!tsconfig.compilerOptions.paths) {
    tsconfig.compilerOptions.paths = {};
  }

  tsconfig.compilerOptions.paths["@symmio/frontend-sdk/*"] = [
    "../../packages/core/src/*",
  ];

  fs.writeFile(
    tsconfigPath,
    JSON.stringify(tsconfig, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("Path added successfully.");
      }
    }
  );
});
