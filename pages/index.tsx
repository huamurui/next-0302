import Head from 'next/head'
import Date from '../components/date'
import Layout, { siteTitle } from '../components/layout'
import Tag, { getChoice } from '../components/tag'

import utilStyles from '../styles/utils.module.css'

import { getSortedPostsData } from '../lib/posts'
import { getAllTags } from '../lib/posts'

import Link from 'next/link'
import { GetStaticProps } from 'next'

export default function Home({
  allPostsData,
  tags,
  // choice
}: {
  allPostsData: {
    date: string
    title: string
    id: string
    tag: string[]
  }[],
  tags: string[],
  // choice: string[]
}) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>want big big big hugs......................</p>
      </section>
      <Tag tags={tags} />
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.filter(
            // (item) =>choice?.every((tag) => item?.tag?.includes(tag))
            (item) => true
          ).map(({ id, date, title, tag }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
              <small className={utilStyles.lightText}>
                {tag?.map((item) => (
                  <span key={item}> {item} </span>
                ))}
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}



export const getStaticProps:GetStaticProps = async () => {
  // https://github.com/vercel/next.js/issues/11993
  // 哦豁...不管吗。。
  let allPostsData = JSON.parse(JSON.stringify(getSortedPostsData()))
  // 虽然这样算是把 tag 拿到了...但是这这 api 用起来是真不爽.... 太多不知道它怎么处理的了
  let tags:string[] = JSON.parse(JSON.stringify(getAllTags()))
  // let choice:string[] =  JSON.parse(JSON.stringify(getChoice()))
  return {
    props: {
      allPostsData,
      tags,
      // choice
    }
  }
}

