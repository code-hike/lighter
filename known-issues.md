## New grammars

`lighter` uses the grammars from the `tm-grammars` package. When a grammar is updated you can use the new version by updating the `tm-grammars` package. But when a new grammar is added to `tm-grammars` we need to release a new version of `lighter` to include it.

To release a new version including new grammars:

- Update and download the `tm-grammars` dependency
- Run `yarn regenerate`
- Add a changeset (`yarn changeset`)
- Commit and push the changes

## "Fetching resource from network" warning

Sometimes `lighter` fails to use the file system to get the grammars or themes, as a fallback it tries to fetch them from the network.

This is expected if you use `lighter` from the browser (or from an edge runtime which identifies itself as a browser).
