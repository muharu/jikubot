import * as esbuild from "esbuild";

const build = async () => {
  try {
    console.log("Starting the build process...");

    await esbuild.build({
      entryPoints: ["src/**/*.ts"],
      bundle: true,
      platform: "node",
      outdir: "dist",
      treeShaking: true,
    });

    console.log("Build completed successfully.");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};

build();
