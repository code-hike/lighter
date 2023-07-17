import { Code } from "./code";
const code = `# hello

<CH.Code>

~~~python one.py
print("Hello, one!")
~~~

~~~python two.py
print("Hello, two!")
~~~

</CH.Code>

~~~js
// to edit the code click the pencil icon ☝️
// click anywhere else to edit the colors
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null ? 0 : ipsum.sit;
  dolor = sit - amet(dolor);
  return dolor;
}

function consectetur(...adipiscing) {
  const elit = adipiscing[0];
  return sed.eiusmod(elit) ? elit : [elit];
}
~~~

<CH.Section>

~~~python
def lorem(ipsum):
  ipsum + 1
~~~

Something _\`def lorem(ipsum)\`_

</CH.Section>

~~~py
print 2
~~~`;
export default function Page() {
  return (
    <div style={{ background: "#333" }}>
      <Code lang="mdx" theme="github-from-css">
        {code}
      </Code>
      <div data-theme="light">
        <Code lang="mdx" theme="github-from-css">
          {code}
        </Code>
      </div>
    </div>
  );
}

export const runtime = "edge";
