import { highlight, extractAnnotations } from "../dist/index.esm.mjs";
import { runAnnotationTests } from "./annotations.js";
import { runTests } from "./highlight.js";

runTests({ highlight });
runAnnotationTests({ extractAnnotations, highlight });
