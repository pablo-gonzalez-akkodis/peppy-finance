// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

const appsDir = "./apps"; // Replace with the actual path to your 'apps' directory

// Function to update tsconfig.json
function updateTsConfig(folderPath) {
  const tsconfigPath = path.join(folderPath, "tsconfig.json");

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
          console.log(`Path added successfully in ${tsconfigPath}.`);
        }
      }
    );
  });
}

// Read all folders in 'apps' directory
fs.readdir(appsDir, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error("Error reading apps directory:", err);
    return;
  }

  files.forEach((dirent) => {
    if (dirent.isDirectory()) {
      const folderPath = path.join(appsDir, dirent.name);
      updateTsConfig(folderPath);
    }
  });
});
