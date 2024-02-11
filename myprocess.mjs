import fs from "fs-extra"
async function readFileAndConvertToJSON(path) {
    const raw = await fs.readFile(path)
    return JSON.parse(raw)
}

export async function myprocess() {
    let filePath
    filePath = process.argv[2]

    console.log("inputFile", filePath)

    const json = await readFileAndConvertToJSON(filePath)

    let changes = ""
    json.forEach(obj => {
        const title = obj.title
        const number = obj.number
        const labels = obj.labels.map(label => label.name)
        changes += `#${number}: ${title} [${labels.join(", ")}]\n`
    })

    process.stdout.write(changes)
} 
