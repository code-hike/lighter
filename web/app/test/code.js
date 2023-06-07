import { getThemeColors, highlight } from "@code-hike/lighter";

export async function Code({
  children,
  lang,
  style,
  className,
  lineNumbers,
  theme,
}) {
  const { lines, style: s } = await highlight(children, lang, theme);

  const colors = await getThemeColors(theme);

  const { color, background } = s;

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
        color,
        background,
        // border: "1px solid " + background,
        padding: "1em",
        borderRadius: "4px",
        // colorScheme,
        ...style,
      }}
    >
      <style>{`
      code ::selection {
        background-color: ${colors.editor.selectionBackground};
      }
      .bright-ln { 
        color: ${colors.editorLineNumber.foreground}; 
        padding-right: 2ch; 
        display: inline-block;
        text-align: right;
        user-select: none;
      }`}</style>
      <code>{kids}</code>
    </pre>
  );
}
