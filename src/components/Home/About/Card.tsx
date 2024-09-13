import styles from './Card.module.css'

export default function Card({
  SVGIcon,
  title,
  description
}: {
  SVGIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
}) {
  return (
    <div className={styles.cardContainer}>
      <SVGIcon className={styles.cardIcon} />

      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </div>
  )
}
