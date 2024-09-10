import Accordion from '@components/@shared/Accordion'
import styles from './index.module.css'
import { ReactElement } from 'react'

interface ContentItem {
  id: number
  keyword: string
  description: string
}

interface Card {
  id: number
  title: string
  image?: string
  content: ContentItem[]
}

type CardsData = Card[]

export default function About({
  accordionContent
}: {
  accordionContent: CardsData
}): ReactElement {
  return (
    <section className={styles.accordionsContainer}>
      <p className={styles.sectionDescription}>
        A curated framework of Open Source Platform components to accelerate the
        development of{' '}
        <span className={styles.gradientText}>Smart Solutions</span>
      </p>
      {accordionContent.map((accordionElement) => {
        const { id, title, content } = accordionElement
        return (
          <Accordion key={id} title={title}>
            <ol>
              {content.map((accordionParagraph) => {
                const { id, keyword, description } = accordionParagraph
                return (
                  <li key={id}>
                    <strong>{keyword}</strong>
                    {' ' + description}
                  </li>
                )
              })}
            </ol>
          </Accordion>
        )
      })}
    </section>
  )
}
