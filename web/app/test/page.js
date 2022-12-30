import { Code } from "./code";

export default function Page() {
  return (
    <div>
      <Code lang="py" theme="slack-dark">
        print 2
      </Code>
    </div>
  );
}
