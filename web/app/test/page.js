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
      <Code lang="terminal" theme="material-darker">
        {terminalCode}
      </Code>
    </div>
  );
}

const terminalCode = `
[35m❯[0m npm create astro -y

╭─────╮  [36;1mHouston:
[0m│ ◠ [96m◡[0m ◠  Initiating launch sequence...
╰─────╯

[42m [30mastro[39m [0m  [32;1mv2.9.2[0m [1mLaunch sequence initiated.

[0m  [48;2;136;58;226m [97mdir[39m [0m  Where should we create your new project?
         [2m./cosmic-chroma

[0m [48;2;136;58;226m [97mtmpl[39m [0m  How would you like to start your new project?
         [2mEmpty
[0m      [32m✔[0m  [32mTemplate copied

[0m [48;2;136;58;226m [97mdeps[39m [0m  Install dependencies?
         [2mNo
[0m      [36m◼[0m  [36mNo problem!
[0m         [2mRemember to install dependencies after setup.

[0m   [48;2;136;58;226m [97mts[39m [0m  Do you plan to write TypeScript?
         [2mNo
[0m      [36m◼[0m  [36mNo worries!
[0m         [2mTypeScript is supported in Astro by default,
[0m         [2mbut you are free to continue writing JavaScript instead.

[0m  [48;2;136;58;226m [97mgit[39m [0m  Initialize a new git repository?
         [2mNo
[0m      [36m◼[0m  [36mSounds good!
[0m         [2mYou can always run [0mgit init[2m manually.

[0m [46m [30mnext[39m [0m  [1mLiftoff confirmed. Explore your project!

[0m Enter your project directory using [36mcd ./cosmic-chroma 
[0m Run [36mnpm run dev[0m to start the dev server. [36mCTRL+C[0m to stop.
 Add frameworks like [36mreact[0m or [36mtailwind[0m using [36mastro add[0m.

 Stuck? Join us at [36mhttps://astro.build/chat

[0m╭─────╮  [36;1mHouston:
[0m│ ◠ [96m◡[0m ◠  Good luck out there, astronaut! 🚀
╰─────╯`.trim();

export const runtime = "edge";
