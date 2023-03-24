import { Code } from "./code";

export default function Page() {
  return (
    <div style={{ background: "#333" }}>
      <Code lang="mdx" theme="slack-dark">
        {`# hello

<CH.Code>

~~~python one.py
print("Hello, one!")
~~~

~~~python two.py
print("Hello, two!")
~~~

</CH.Code>

~~~js
const re = /ab+c/;
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
~~~`}
      </Code>
      <Code lang="py" theme="slack-dark">
        print 2
      </Code>
    </div>
  );
}
