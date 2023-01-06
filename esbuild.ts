import {build} from "esbuild";

await build({
    entryPoints: ["src/index.ts"]
})