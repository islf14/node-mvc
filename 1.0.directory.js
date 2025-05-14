import fs from 'node:fs/promises'
import path from 'node:path'
import pc from 'picocolors'

const folder = process.argv[2] ?? '.'

async function ls (folder) {
  let files
  try {
    files = await fs.readdir(folder)
  } catch {
    console.log(pc.red(`Cannot read the directory: ${files}`))
    process.exit(1)
  }

  const filePromises = files.map(async file => {
    const filePath = path.join(folder, file)
    let stats
    try {
      stats = await fs.stat(filePath)
    } catch {
      console.log(`Cannot view the file: ${filePath}`)
      process.exit(1)
    }
    const isDirectory = stats.isDirectory()
    const fileType = isDirectory ? 'd' : 'f'
    const fileSize = stats.size.toString()
    const fileModified = stats.mtime.toLocaleString()
    return `${pc.bgMagenta(fileType)} ${pc.blue(file.padEnd(20))} ${pc.green(fileSize.padStart(10))} ${pc.yellow(fileModified)}`
  })
  const filesInfo = await Promise.all(filePromises)
  filesInfo.forEach(fileInfo => console.log(fileInfo))
}

ls(folder)
