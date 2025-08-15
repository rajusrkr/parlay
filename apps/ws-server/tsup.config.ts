import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    format: ["cjs"],
    clean: true,
    sourcemap: true,
    dts: false,
    target: "node18",
    esbuildOptions(options){
        options.alias = {
            shared: "../../packages/shared"
        }
    }
})