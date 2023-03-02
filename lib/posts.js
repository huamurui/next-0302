import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')
// Define a function that takes a folder path as an argument
function getAllFilePaths(folder) {
  // Initialize an empty array to store the relative paths
  let relativePaths = [];
  // Read the contents of the folder using fs.readdirSync()
  let items = fs.readdirSync(folder);
  // Loop through each item in the folder
  for (let item of items) {
    // Join the folder path and the item name to get the full path
    let fullPath = path.join(folder, item);
    // Check if the item is a file or a directory using fs.statSync()
    let stat = fs.statSync(fullPath);
    if (stat.isFile()) {
      // If it is a file, use path.relative() to get its relative path from current working directory
      let relativePath = path.relative(process.cwd(), fullPath);
      // Push its relative path to the array
      relativePaths.push(relativePath);
    } else if (stat.isDirectory()) {
      // If it is a directory, call the function recursively with its full path
      relativePaths = relativePaths.concat(getAllFilePaths(fullPath));
    }
  }
  // Return the array of relative paths
  return relativePaths;
}

export function getSortedPostsData() {
  // Get file names under /posts
  // i hope a function to read all the files in the directory recursively

  // const fileNames = fs.readdirSync(postsDirectory)
  const fileNames = getAllFilePaths(postsDirectory)
  const allPostsData = fileNames.filter(fileName=>{
    // Only include .md files
    return fileName.endsWith('.md')
  }).map(fileName => {
    // Remove ".md" and '//' from file name to get id
    const id = fileName.replace(/\.md$/, '').replace(/\\/g, '/')

    // Read markdown file as string
    // const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fileName, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const fileNames = getAllFilePaths(postsDirectory)
  fileNames.filter(fileName=>{
    // Only include .md files
    return fileName.endsWith('.md')
  })
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '').replace(/\\/g, '/').split('/')
      }
    }
  })
}

export async function getPostData(id) {

  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()
  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}