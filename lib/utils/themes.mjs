import fs from "fs";

const files = fs.readdirSync("./themes");

const ids = files
  .filter((f) => f.endsWith("json"))
  .map((f) => f.replace(".json", ""));

export default ids;
