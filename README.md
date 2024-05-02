<h1><span style="vertical-align: text-top;">👉&nbsp;</span>snitch</h1>

⚠️ this project was formerly named _ghif_ but beginning with v2 has diverged significantly enough from that codebase to warrant a new name and rebranding while maintaining all its previous git history.

A terminal utility for generating attractive, formatted, and interactive status reports from your GitHub project's issues.

<img style="border-radius: 3px; border: 2px solid #ffffff; margin: 24px 0; box-shadow: 4px 4px 1px 1px #888" src="./readme-assets/demo.gif" alt="changelog image">
<br>

### 5 Report Types To Chose From

| Report Name | Description | Example |
| :-- | :-- | :-- |
| list | a list of issues | `snitch --name=list > snitch-report.md` |
| milestone | a list of issues by milestone | `snitch --name=milestone > snitch-report.md` |
| milestone-label | a list of issues by milestone and label | `snitch --name=milestone-label > snitch-report.md` |
| label | a list of issues by label | `snitch --name=label > snitch-report.md` | 
| assignee | a list of issues by assignee | `snitch --name=assignee > snitch-report.md` | 

⚠️ Reports in both _markdown_ and _text_ are supported. However, please note that interactive reports (reports whose elements provide links back to their respective GitHub repositories) are only supported in markdown.

### Options

| Option | Description | Default (if omitted)| Example |
| :-- | :-- | :-- | :-- |
| --repo=[path to repository] | path to Github repository | the GitHub repository associated with the current project determined by git remote origin | `--repo=4awpawz/snitch` |
| --state=[all \| open \| closed] | limit reporting to issues with this state | all | `--state=closed` |
| --max-issues=integer | maximum number of issues to report on | 10000 | `--max-issues=100000` |
| --md | generate the report in markdown | --md if neither --md nor --txt are provided | md | `--txt` |
| --txt | generate the report in plain text | --md if neither --md nor --txt are provided | md | `--txt` |
| --name=[list \| milestone \| milestone-label \| label \| assignee] | type of report to generate | list | `--name=milestone-label` |
| --heading=[report heading] | the heading for the report | repository name | `--heading=CHANGELOG` |
| --max-length=integer | the max length in characters of the report line | 80 | `--max-length=100` |
| --wrap | report lines should wrap when their length exceeds --maxLength | --wrap if neither --wrap nor --crop are provided | `--wrap` |
| --crop | report lines should be cropped when their length exceeds --maxLength and appended with an elipsis | --wrap if neither --wrap nor --crop are provided | `--crop` |

#### Debug mode

If something goes wrong, you can run snitch in _debug mode_ to expose the dynamically generated configuration data that would be used during the processing of the payload returned from GitHub's _gh_ utility as well as the command line that would be used to invoke _gh_ itself. This information could be extremely useful when submitting an issue to us or for your own problem resolution.

To invoke debug mode, append `--debug` to the command line that you would use to generate your desired report, such as the list report in the command below:

```shell
> snitch --name=list --state=open --repo=4awpawz/snitch --debug 
```

The output from running snitch in debug mode would look similar to the following:

```shell
debug config:  {
  debug: true,
  repo: 'https://github.com/4awpawz/snitch',
  state: 'open',
  maxIssues: 10000,
  fileType: 'md',
  reportName: 'list',
  heading: '4awpawz/snitch',
  maxLength: 80,
  wrap: true,
  crop: false
}
debug gh command:  gh issue list -L 10000 --state open --json 'number,title,labels,milestone,state,assignees,url' -R https://github.com/4awpawz/snitch
```

You can also run the _debug gh command_ to examine the JSON payload returned by GitHub's _gh_ utility:

```shell
> gh issue list -L 10000 --state open --json 'number,title,labels,milestone,state,assignees,url' -R https://github.com/4awpawz/snitch
```

### Installation

⚠️ snitch requires both [Node.js](https://nodejs.org/en) and Github's [gh](https://cli.github.com) utility

To install snitch with NPM, please run the following command in your terminal:

```shell
> npm i -g 4awpawz/snitch
```

### Examples

#### A changelog

```shell
> snitch --name=list --state=closed > CHANGELOG.md
```
#### A status report by assignee

```shell
> snitch --txt --name=assignee > status.md
```

### Request a new report format

Have an idea for a report format that is not yet supported? Then by all means please submit a request along with a detailed description of the report you are seeking.

## License

MIT

### Show some love ❤️
![image](./readme-assets/buymeacoffee.png)

If using _snitch_ provides you value then please click on the repository's _Star_ button.

If you would like to be notified when there are changes then please click on the repository's _Watch_ button.
