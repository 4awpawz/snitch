# ghif, an issues formatter for Github's gh CLI issues 

Maintaining a project's changelog shouldn't be a chore yet it often ends up being one. Having to repetitively cut and paste from our Github issues into our project's changelog and then having to format everything in a consistent manner can be a significant task in its own right.
That's where __ghif__ steps in to radically reduce the effort of changelog maintenance.

ghif is a simple command line utility that takes the issues output from Github's `gh issue list --json "number,title,labels"` command, formats them according to any additional ghif formatting options that you provide (please see below), and then sends the formatted output to stdout. 

<span style="color: orange;">* </span>ghif expects _gh issue_ to return JSON and for issue objects to contain the _number, title and labels_ fields and will fail to run otherwise. Therefor the minimum gh issue command required is the following:

```console
> gh issue list --json "number,title,labels"
```

You can, of course, include any of the _gh issue filters_ that support your project's use case, such as _status (-s), repository (--repo), milestone (-m), etc_. 

## Installation

<span style="color: orange;">* </span> Requires [Github CLI](https://cli.github.com/)

## Supported output format

ghif gives you the option of formatting its output as plain text

```shell
ghif
```

or as an unordered markdown list

```shell
ghif --markdown-unordered-list
```

or as an ordered markdown list

```shell
ghif --markdown-ordered-list
```

which should suffice most use cases.

## Output Examples

Example: _Output issues as plain text_

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
Example: _Output issues as an unordered list in markdown_

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

Example: _Output issues as an ordered list in markdown_

```markdown
1. #98: Unresolved token reporting drops the last closing brace for include tokens. [bug, revision]
1. #97: Log warning to the console if user project does not have a 404.html document. [feature, revision]
1. #96: Though template front matter is documented as a requirement, this is not enforced in the codebase. [wontfix, revision]
1. #95: Update to Node v18.18.0 LTS and address all related issues. [revision]
1. #94: Include cache bust metric when release is called without the --verbose option and is called with the --cache-bust option. [revision]
1. #93: Refactor the cli help to accommodate multiple command options. [feature]
1. #92: Provide CLI --verbose logging option. [feature, revision]
1. #91: Update Buster dependency to v1.1.0. [revision]
```

```shell
> npm i -g 4awpawz/ghif
```
## Usage Examples

_Output text to the terminal_

```shell
> gh issue list -s closed -m "v1.3.0" --json "number,title,labels" --repo 4awpawz/fusion.ssg | ghif
```

_Pipe text output to a text file_

```shell
> gh issue list -s closed -m "v1.3.0" --json "number,title,labels" --repo 4awpawz/fusion.ssg | ghif > issues.txt
```

_Pipe markdown output to a markdown file_

```shell
> gh issue list -s closed -m "v1.3.0" --json "number,title,labels" --repo 4awpawz/fusion.ssg | ghif --markdown-unordered-list --blank-line-between-issues > issues.md
```

### Options

- Output issues as plain text, `default`
- Output a blank line between issues, `--blank-line-between-issues`
- Output issues as markdown in an unordered list, `--markdown-unordered-list`
- Output issues as markdown in an ordered list, `--markdown-ordered-list`

## Show some love <span>❤️</span>

If using ghif provides you value then please click on the repository's _Star_ button.

If you would like to be notified when there are changes then please click on the repository's _Watch_ button.
