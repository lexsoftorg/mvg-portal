import { ReactElement } from 'react'
import { markdownToHtmlWithToc } from '@utils/markdown'
import { getPageBySlug, getAllPages, PageData } from '@utils/markdownPages'
import Page from '@shared/Page'
import styles from '@shared/Page/PageMarkdown.module.css'
import Container from '@shared/atoms/Container'
import PrivacyPolicyHeader from '../../components/Privacy/PrivacyHeader'
import { useRouter } from 'next/router'

export default function PageMarkdown(
  page: PageData & { usePrivacyPolicyHeader: boolean }
): ReactElement {
  const router = useRouter()
  if (!page || page.content === '') return null
  const { title, description } = page.frontmatter
  const { slug, content, usePrivacyPolicyHeader } = page

  return (
    <Page
      title={title}
      description={description}
      uri={router.asPath}
      headerCenter
    >
      <Container narrow>
        {usePrivacyPolicyHeader && (
          <PrivacyPolicyHeader policy={slug.replace('/privacy/', '')} />
        )}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Container>
    </Page>
  )
}

export async function getStaticProps({
  params
}: {
  params: { slug: string }
}): Promise<{ props: PageData & { usePrivacyPolicyHeader: boolean } }> {
  const page = getPageBySlug(params.slug, 'privacy')
  const content = markdownToHtmlWithToc(page?.content || '')

  const usePrivacyPolicyHeader = false

  return {
    props: { ...page, content, usePrivacyPolicyHeader }
  }
}

export async function getStaticPaths(): Promise<{
  paths: {
    params: {
      slug: string
    }
  }[]
  fallback: boolean
}> {
  const pages = getAllPages('privacy')

  return {
    paths: pages.map((page) => {
      return {
        params: { slug: page.slug }
      }
    }),
    fallback: false
  }
}
