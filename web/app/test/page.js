import { Code } from "./code";

export default function Page() {
  return (
    <div>
      <Code lang="md" theme="slack-dark">
        {`# hello

~~~js
const re = /ab+c/;
~~~

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
