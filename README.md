# ghif

An easy to use terminal utility based on GitHub's CLI that generates attractive formatted reports that can be used for project status reporting and for maintaining a project's changelog.

<img style="border-radius: 3px; border: 2px solid #ffffff; margin: 24px 0; box-shadow: 4px 4px 1px 1px #888" src="./readme-assets/demo.gif" alt="changelog image">
<br>

Maintaining a project's changelog can often end up being a project in its own right, involvong having to repetitively cut and paste from our GitHub repo's issues into our project's changelog, and then having to format everything in a consistent manner. That's where _ghif_ steps in to radically reduce the effort of changelog maintenance.

ghif reduces the burden of changelog maintenance to a single command, e.g., `ghif --report-list-txt --colorized-labels --heading=CHANGELOG --state=closed --repo=4awpawz/fusion.ssg > CHANGELOG.md`,

## Installation

### ⚠️ Dependencies

ghif relies on GitHub's cli to generate its list of issues from you project's repo, so please [install gh if you haven't done so](https://cli.github.com) already.

To install ghif, please run the following command in your terminal:

```shell
> npm i -g 4awpawz/ghif
```

## 3 Report Types And 18 Variants To Chose From

⚠️  Please submit a request for a report type that you would life to see added. We will take every request into consideration and implement it if possible.

## Report Types And Variants
| Report Type | Report Variant | Description |
| :-- | :-- | :-- |
| list of issues | --report-list-txt | list of issues as plain text |
| | --report-list-md | list of issues as markdown |
| | --report-list-bulleted-txt | list of bulleted issues as plain text |
| | --report-list-bulleted-md | list of bulleted issues as markdown |
| | --report-list-numbered-txt | list of numbered issues as plain text |
| | --report-list-numbered-md | list of numbered issues as markdown |
| list of issues grouped by milestone | --report-milestone-list-txt | list of issues grouped by milestone as plain text |
| | --report-milestone-list-md | list of issues grouped by milestone as markdown |
| | --report-milestone-bulleted-txt | list of bulleted issues grouped by milestone as plain text |
| | --report-milestone-bulleted-md | list of bulleted issues grouped by milestone as markdown |
| | --report-milestone-numbered-txt | list of numbered issues grouped by milestone as plain text |
| | --report-milestone-numbered-md | list of numbered issues grouped by milestone as markdown |
| list of issues grouped by milestone and label | --report-milestone-label-list-txt | list of issues grouped by milestone and label as plain text |
| | --report-milestone-label-list-md | list of issues grouped by milestone and label as markdown |
| | --report-milestone-label-bulleted-txt | list of bulleted issues grouped by milestone and label as plain text |
| | --report-milestone-label-bulleted-md | list of bulleted issues grouped by milestone and label as markdown |
| | --report-milestone-label-numbered-txt | list of numbered issues grouped by milestone and label as plain text |
| | --report-milestone-label-numbered-md | list of numbered issues grouped by milestone and label as markdown |
### Report Options
| Option| Description |
| :-- | :-- |
| --repo= | the GitHub repository (as [HOST/]OWNER/REPO) to be reported (e.g., --repo=4awpawz/fusion.ssg), applicable for all report types, optional, if omitted defaults to the repo associated with the current project |
| --max-issues= | the maximum number  of issues to report (e.g., --max-issues=500), applicable for all report types, optional, if omitted defaults to 300 |
| --heading=       | adds a heading to the top of the report (e.g., --heading=CHANGELOG), applicable for all report types, optional, if omitted defaults to no heading |
| --state= | filter issues by their state (i.e., all \| open \| closed) (e.g., --state=all), applicable for all report types, optional, if omitted defaults to 'closed' |
| --show-state | report issue's state, applicable for all report types, optional, if omitted issue's state is not reported |
| --show-assignees | report issue's assigness, applicable for all report types, optional, if omitted issue's assignees is not reported |
| --blank-line     | adds a blank line between issues, applicable for txt report variants only (see Report Variant in the above table), optional, if omitted defaults to no blank line between issues|
| --colorized-labels | colorizes labels, applicable for md report variants only (see Report Variant in the above table), optional, if omitted defaults to not colorizing labels |

## Usage example
_Output changelog directly to CHANGELOG.md_
```shell
> ghif --report-milestone-label-list-md --colorized-labels --heading=CHANGELOG --state=closed --repo=fawpawz/fusion.ssg > CHANGELOG.md
```
⚠️ Create a pacakge.json script for the changelog report you want to generate and run it as part of your project's release process!

## Show some love ❤️
<a href="https://www.buymeacoffee.com/4awpawz"><img src="./readme-assets/buymeacoffee.png" alt="image"></a>

If using _ghif_ provides you value then please click on the repository's _Star_ button.

If you would like to be notified when there are changes then please click on the repository's _Watch_ button.

