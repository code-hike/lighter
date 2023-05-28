import { highlight } from "@code-hike/lighter";

export async function Code({
  children,
  lang,
  style,
  className,
  lineNumbers,
  theme,
}) {
  const { lines, colors } = await highlight(children, lang, theme);
  // console.log({ colors });

  const {
    foreground,
    background,
    colorScheme,
    selectionBackground,
    lineNumberForeground,
  } = colors;

  const lineCount = lines.length;
  const digits = lineCount.toString().length;

  const kids = lines.map((tokens, i) => {
    return (
      <span key={i}>
        {lineNumbers && (
          <span className="bright-ln" style={{ width: `${digits}ch` }}>
            {i + 1}
          </span>
        )}
        {tokens.map((t, j) => (
          <span key={j} style={t.style}>
            {t.content}
          </span>
        ))}
        <br />
      </span>
    );
  });

  return (
    <pre
      className={className}
      style={{
        color: foreground,
        background,
        // border: "1px solid " + background,
        padding: "1em",
        borderRadius: "4px",
        colorScheme,
        ...style,
      }}
    >
      <style>{`
      code ::selection {
        background-color: ${selectionBackground}
      }
      .bright-ln { 
        color: ${lineNumberForeground}; 
        padding-right: 2ch; 
        display: inline-block;
        text-align: right;
        user-select: none;
      }`}</style>
      <code>{kids}</code>
    </pre>
  );
}
