# ghif, an issues formatter for Github's gh CLI issues 

Maintaining a project's changelog shouldn't be a chore yet it often ends up being one. Having to repetitively cut and paste from our Github issues into our project's changelog and then having to format everything in a consistent manner can be a significant task in its own right.
That's where __ghif__ steps in to radically reduce the effort of changelog maintenance.

ghif is a simple command line utility that takes the issues output from Github's `gh issue list --json "number,title,labels"` command, formats them according to any additional ghif _formatting options_ that you provide (please see below), and then sends the formatted output to stdout. 

<span style="color: orange;">* </span>ghif expects _gh issue_ to return JSON and for issue objects to contain the _number, title and labels_ fields and will fail to run otherwise. Therefor the minimum gh issue command required is the following:
```console
> gh issue list --json "number,title,labels"
```
You can, of course, include any of the _gh issue filters_ that support your project's use case, such as _status (-s), repository (--repo), milestone (-m), etc_. 

## Installation

<span style="color: orange;">* </span> Requires [Github CLI](https://cli.github.com/)
```shell
> npm i -g 4awpawz/ghif
```
## Supported output formats and examples
### Plain text
```shell
> gh issue list --json "number,title,labels" | ghif --text
```
Example: _a list of issues_
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
### Markdown
As a list:
```shell
> gh issue list --json "number,title,labels" | ghif --markdown-list
```
Example: _a list of issues_
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
As an unordered list:
```shell
> gh issue list --json "number,title,labels" | ghif --markdown-unordered-list
```
Example: _an unordered list of issues_
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
As an ordered list:
```shell
> gh issue list --json "number,title,labels" | ghif --markdown-ordered-list
```
Example: _an ordered list of issues_
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
## Usage examples
_Output text to the terminal_
```shell
> gh issue list -s closed -m "v1.3.0" --json "number,title,labels" --repo 4awpawz/fusion.ssg | ghif --text
```
_Pipe text output to a text file_
```shell
> gh issue list -s closed -m "v1.3.0" --json "number,title,labels" --repo 4awpawz/fusion.ssg | ghif --text > issues.txt
```
_Pipe markdown output to a markdown file_
```shell
> gh issue list -s closed -m "v1.3.0" --json "number,title,labels" --repo 4awpawz/fusion.ssg | ghif --markdown-unordered-list --blank-line-between-issues > issues.md
```
### Formatting options
- `--colored-labels`: colorize labels, ignored if output format is not markdown
- `--blank-line-between-issues`: output a blank line between issues 
- `--text`: output a list of issues as plain text
- `--markdown-list`: output a list of issues in markdown
- `--markdown-unordered-list`: output an unordered list of issues in markdown
- `--markdown-ordered-list`: output an ordered list of issues in markdown
## Show some love ❤️
If using ghif provides you value then please click on the repository's _Star_ button.

If you would like to be notified when there are changes then please click on the repository's _Watch_ button.
