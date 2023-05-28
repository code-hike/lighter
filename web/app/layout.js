import "@code-hike/lighter/themes/github-from-css.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <body>{children}</body>
    </html>
  );
}
