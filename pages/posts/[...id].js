import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
export default function Post({ postData }) {
  // https://github.com/vercel/next.js/discussions/15944
  // 如果是刷新或者直接访问，那么就会出现，postData是undefined的情况
  // 一堆奇奇怪怪...
  if ( !postData ) {
    return <div>loading...</div>
  }
  if ( postData === 'not md' ) {
    return <div>not md</div>
  }
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}




export async function getStaticPaths() {
  let paths = getAllPostIds()
  return {
    paths,
    //https://stackoverflow.com/questions/69527709/getstaticpaths-returns-404-page-not-found
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  let postData = await getPostData(params.id.join('/'))
  postData = JSON.parse(JSON.stringify(postData))
  return {
    props: {
      postData
    }
  }
}
