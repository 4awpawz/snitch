import fs from "fs-extra"

// async function readFileAndConvertToJSON(path) {
//     const raw = await fs.readFile(path)
//     return JSON.parse(raw)
// }
//
async function getPipedIn() {
    console.log("here!!!!!!!!!!!!!!!!!!!!")
    let data = ""
    for await (const chunk of process.stdin) {
        data += chunk
    }
    return data
}

export async function ghif() {
    // let filePath
    // filePath = process.argv[2]
    //
    // console.log("inputFile", filePath)
    //
    // const json = await readFileAndConvertToJSON(filePath)

    const json = JSON.parse(await getPipedIn())
    let issues = ""
    json.forEach(obj => {
        const title = obj.title
        const number = obj.number
        const labels = obj.labels.map(label => label.name)
        issues += `#${number}: ${title} [${labels.join(", ")}]\n`
    })

    process.stdout.write(issues)
} 
