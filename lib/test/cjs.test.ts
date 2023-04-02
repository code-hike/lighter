import { highlight, extractAnnotations } from "../dist/index.cjs.js";
import { runTests } from "./highlight.js";
import { runAnnotationTests } from "./annotations.js";

runTests({ highlight });

runAnnotationTests({ extractAnnotations, highlight });
