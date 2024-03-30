export function extractor(comment: string, prefix: string = "!") {
  // const regex = /\s*(!?[\w-]+)?(\([^\)]*\)|\[[^\]]*\])?(.*)$/;

  const regex = new RegExp(
    `\\s*(${prefix}?[\\w-]+)?(\\([^\\)]*\\)|\\[[^\\]]*\\])?(.*)$`
  );
  const match = comment.match(regex);
  const name = match[1];
  const rangeString = match[2];
  const query = match[3]?.trim();
  if (!name || !name.startsWith(prefix)) {
    return null;
  }
  return {
    name: name.slice(prefix.length),
    rangeString,
    query,
  };
}
