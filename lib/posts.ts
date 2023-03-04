import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')
function getAllFilePaths(folder: string) {
  let relativePaths:string[] = [];
  let items = fs.readdirSync(folder);
  for (let item of items) {
    let fullPath = path.join(folder, item);
    let stat = fs.statSync(fullPath);
    if (stat.isFile()) {
      let relativePath = path.relative(process.cwd(), fullPath);
      relativePaths.push(relativePath);
    } else if (stat.isDirectory()) {
      relativePaths = relativePaths.concat(getAllFilePaths(fullPath));
    }
  }
  return relativePaths;
}

export function getSortedPostsData() {
  // Get file names under /posts

  const fileNames = getAllFilePaths(postsDirectory)
  const allPostsData = fileNames.filter(
    (it) => it.endsWith('.md')
  ).map(fileName => {
    // Remove '//' to '/' from file name to get id
    const id = fileName.replace(/\\/g, '/')

    // Read markdown file as string
    const fileContents = fs.readFileSync(fileName, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as { date: string; title: string })
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

// 我们确实只希望渲染 md 文件到页面上展示，但是也是想要把图片文件也读取出来的。。。

export function getAllPostIds() {
  const fileNames = getAllFilePaths(postsDirectory)
  return fileNames.map(fileName => {
    // 转成数组并去掉第一个元素 'posts'
    let id :string[] = fileName.replace(/\\/g, '/').split('/').slice(1)
    return {
      params: {
        id: id as string[]
      }
    }
  })
}

export async function getPostData(id :string) {
  if(!id.endsWith('.md')) {
    // 这里是图片一类的文件，也需要渲染成一个页面...用以引入

    return {
      type: id.replace(/\\/g, '/').split('.').pop(),
      id,
    }
  }

  const fullPath = path.join(postsDirectory, `${id}`)
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
    type: 'md',
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string })
  }
}
