# ghif, an issues formatter for Github's gh CLI issues 

Maintaining a project's changelog shouldn't be a chore yet it often ends up being one of having to repetitively cut and paste from our Github issues into our project's changelog and then having to format everything in a consistent manner.

ghif is a simple command line utility that can dramatically reduce the chore of manually maintaining your project's changelog. ghif requires a single terminal command that retrieves a list of issues from your project's Github repository using Github's CLI `gh issue list` command and pipes the output from that into ghif, which formats the issues according to the options that you provide and then sends the formatted output to stdout.

ghif gives you the option to format its output in either plain text

```shell
ghif
```

or to markdown

```shell
ghif --markdown-unordered-list
```

which should suffice most use cases.

## Installation

\* [Requires Github CLI](https://cli.github.com/)

```shell
npm i -g 4awpawz/ghif
```

## Output Examples

_Output issues as plain text_

```text
#98: Unresolved token reporting drops the last closing brace for include tokens. [bug, revision]
#97: Log warning to the console if user project does not have a 404.html document. [feature, revision]
#96: Though template front matter is documented as a requirement, this is not enforced in the codebase. [wontfix, revision]
#95: Update to Node v18.18.0 LTS and address all related issues. [revision]
#94: Include cache bust metric when release is called without the --verbose option and is called with the --cache-bust option. [revision]
#93: Refactor the cli help to accommodate multiple command options. [feature]
#92: Provide CLI --verbose logging option. [feature, revision]
#91: Update Buster dependency to v1.1.0. [revision]
```
_Output issues as an unordered list in markdown_

```markdown
- #98: Unresolved token reporting drops the last closing brace for include tokens. [bug, revision]
- #97: Log warning to the console if user project does not have a 404.html document. [feature, revision]
- #96: Though template front matter is documented as a requirement, this is not enforced in the codebase. [wontfix, revision]
- #95: Update to Node v18.18.0 LTS and address all related issues. [revision]
- #94: Include cache bust metric when release is called without the --verbose option and is called with the --cache-bust option. [revision]
- #93: Refactor the cli help to accommodate multiple command options. [feature]
- #92: Provide CLI --verbose logging option. [feature, revision]
- #91: Update Buster dependency to v1.1.0. [revision]
```

_Output issues as an ordered list in markdown_

```markdown
0. #98: Unresolved token reporting drops the last closing brace for include tokens. [bug, revision]
0. #97: Log warning to the console if user project does not have a 404.html document. [feature, revision]
0. #96: Though template front matter is documented as a requirement, this is not enforced in the codebase. [wontfix, revision]
0. #95: Update to Node v18.18.0 LTS and address all related issues. [revision]
0. #94: Include cache bust metric when release is called without the --verbose option and is called with the --cache-bust option. [revision]
0. #93: Refactor the cli help to accommodate multiple command options. [feature]
0. #92: Provide CLI --verbose logging option. [feature, revision]
0. #91: Update Buster dependency to v1.1.0. [revision]
```

## Usage Examples

_output text to the terminal (default)_

```shell
gh issue list -s closed -m "v1.3.0" --json "number,title,labels" --repo 4awpawz/fusion.ssg | ghif
```

_pipe text output to a text file_

```shell
gh issue list -s closed -m "v1.3.0" --json "number,title,labels" --repo 4awpawz/fusion.ssg | ghif > issues.txt
```

_pipe markdown output to a markdown file_

```shell
gh issue list -s closed -m "v1.3.0" --json "number,title,labels" --repo 4awpawz/fusion.ssg | ghif --markdown-unordered-list --blank-line-between-issues > issues.md
```

### Options

- Output issues as plain text, `default`
- Output a blank line between issues, `--blank-line-between-issues`
- Output issues as markdown in an unordered list, `--markdown-unordered-list`
- Output issues as markdown in an ordered list, `--markdown-ordered-list`

## Show some love <span>❤️</span>

If using ghif provides you value then please click on the repository's _Star_ button.

If you would like to be notified when there are changes then please click on the repository's _Watch_ button.
