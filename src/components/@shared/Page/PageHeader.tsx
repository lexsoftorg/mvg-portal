import SearchBar from '@components/Header/SearchBar'
import BrandLogo from '@images/brand-logo-white.svg'
import HeaderBackground from '@images/FIWAREMarketplace_WHITE.svg'
import Markdown from '@shared/Markdown'
import classNames from 'classnames/bind'
import { ReactElement } from 'react'
import NetworkStatus from '../NetworkStatus'
import styles from './PageHeader.module.css'

const cx = classNames.bind(styles)

export default function PageHeader({
  title,
  center,
  description,
  isHome,
  showSearch
}: {
  title: string | ReactElement
  center?: boolean
  description?: string
  isHome?: boolean
  showSearch?: boolean
}): ReactElement {
  const styleClasses = cx({
    header: true,
    center,
    isHome
  })

  return (
    <header className={styleClasses}>
      {isHome ? (
        <div className={styles.homeTitleContainer}>
          <BrandLogo />
          {description && (
            <Markdown text={description} className={styles.subtitle} />
          )}
          <SearchBar
            isHome={isHome}
            placeholder="Search for service offerings"
          />
        </div>
      ) : (
        <div>
          <h1 className={styles.title}>{title}</h1>
          <NetworkStatus className={styles.networkAlert} />
        </div>
      )}
      {description && !isHome && (
        <Markdown text={description} className={styles.description} />
      )}
      {showSearch && (
        <div className={styles.search}>
          <SearchBar placeholder="Search for service offerings" />
        </div>
      )}
    </header>
  )
}
