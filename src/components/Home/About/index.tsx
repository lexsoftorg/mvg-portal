import Card from '../About/Card'
import Container from '@components/@shared/atoms/Container'

import benefits from '../../../../content/pages/home/benefits.json'

import styles from './index.module.css'

import OpenSourceIcon from '@images/Open-source.svg'
import BecomingTrulySmartIcon from '@images/becoming-truly-smart.svg'
import SmartUsageIcon from '@images/smart-usage-of-data.svg'
import SmartSolutionsIcon from '@images/smart-solutions.svg'
import FiwareEcosystemIcon from '@images/Fiware-ecosystem.svg'
import UnleashingIcon from '@images/unleashing-right-time-open-data.svg'
import CommonModelsIcon from '@images/common-info-models.svg'
import ThrivingIcon from '@images/thriving-data-economy.svg'

import AboutIcon from '@images/About.svg'
import FiwareLogo from '@images/fiware-foundation-logo.svg'
import Button from '@components/@shared/atoms/Button'

const svgIconMapping = {
  1: OpenSourceIcon,
  2: SmartUsageIcon,
  3: SmartSolutionsIcon,
  4: FiwareEcosystemIcon,
  5: BecomingTrulySmartIcon,
  6: UnleashingIcon,
  7: CommonModelsIcon,
  8: ThrivingIcon
}

export default function About() {
  return (
    <section id={styles.about}>
      <h2 className={styles.sectionTitle} id={styles.coreStatement}>
        Bringing a curated framework of open source platform components to
        develop a sustainable market of interoperable and scalable Smart Cities
        solutions
      </h2>
      <Container className={styles['container--two-columns']}>
        <div className={styles.leftChild}>
          <h2 className={styles.sectionTitle}>About</h2>
          <p>
            Smart city systems often face the challenge of orchestrating
            seamless end-to-end data value chains, from data creation to
            end-user utilization. This can create challenges in implementing
            smart city initiatives and hinder the participation of startups and
            smaller providers, leading to unequal opportunities and limited
            local economic development.
          </p>
          <p>
            FIWARE reference architectures and technologies have been widely and
            successfully adopted for implementations in various domains
            globally. With FIWARE, cities can achieve transformation with
            minimum effort and great impact by adopting common standard APIs and
            information models.
          </p>
        </div>
        <div className={styles.rightChild}>
          <AboutIcon
            alt="Products and services offered by Fiware"
            id={styles.rightChildImage}
          />
        </div>
      </Container>

      <Container>
        <h2 className={styles.sectionTitle}>Benefits</h2>
        <div className={styles['container--two-by-four']}>
          {benefits.map((cardContent) => (
            <Card
              key={cardContent.id}
              SVGIcon={svgIconMapping[cardContent.id]}
              title={cardContent.title}
              description={cardContent.description}
            />
          ))}
        </div>
      </Container>

      <Container className={styles['container--two-columns']}>
        <div className={styles.leftChild}>
          <h2 className={styles.sectionTitle}>FIWARE Foundation</h2>
          <p>
            FIWARE Foundation is a legal independent non-profit charitable
            organization that provides shared resources to help achieve the
            FIWARE Mission by empowering, promoting, augmenting, protecting, and
            validating the FIWARE technologies and the entire community around
            them.
          </p>
          <p>
            {' '}
            FIWARE reference architectures and technologies have been widely and
            successfully adopted for implementations in various domains
            globally. With FIWARE, cities can achieve transformation with
            minimum effort and great impact by adopting common standard APIs and
            information models.
          </p>
        </div>
        <div className={styles.rightChild}>
          <FiwareLogo alt="Fiware brand logo" id={styles.rightChildLogo} />
          <p>
            FIWARE Foundation is committed to being at the forefront of
            technological evolution by providing the ICT sector with enterprise
            assets and resources to advance operational and systemic
            sustainability.
          </p>
        </div>
      </Container>

      <Container className={styles['container-centered-text']}>
        <h2 className={styles.sectionTitle}>Join Us</h2>
        <p>
          FIWARE members are a powerful multiplier for the creation and use of
          open technology, innovation, and collaborative business models.
        </p>
        <p>
          Accessible to all organizations from start-ups to global players,
          associations, academia, cities, and individuals.
        </p>
        <Button
          href="https://www.fiware.org/about-us/join-us/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Become a Member
        </Button>
      </Container>
    </section>
  )
}
