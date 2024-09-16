import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import Button from '@shared/atoms/Button'
import { useUserPreferences } from '@context/UserPreferences'
import styles from './index.module.css'
import Loader from '@components/@shared/atoms/Loader'

import AssetList from '@components/@shared/AssetList'
import queryString from 'query-string'

import { getResults } from '@components/Search/utils'
import { useCancelToken } from '@hooks/useCancelToken'
import { useDebouncedCallback } from 'use-debounce'
import { Asset } from '@oceanprotocol/lib'
import Container from '@components/@shared/atoms/Container'
import OnboardingSection from '@components/@shared/Onboarding'
import About from './About'

const initialQueryParams = {
  offset: '12',
  sort: 'nft.created',
  sortOrder: 'desc',
  text: 'fiware'
}

function AllAssetsButton(): ReactElement {
  return (
    <Button
      className={styles.allAssetsButton}
      style="text"
      to="/search?sort=nft.created&sortOrder=desc"
      arrow
    >
      All datasets and algorithms
    </Button>
  )
}

export default function HomePage(): ReactElement {
  const { chainIds, showOnboardingModule } = useUserPreferences()

  const [queryResult, setQueryResult] = useState<PagedAssets>()
  const [displayedAssets, setDisplayAssets] = useState<Asset[]>([])
  const [defaultParsed, setDefaultParsed] =
    useState<queryString.ParsedQuery<string>>(initialQueryParams)
  const [loading, setLoading] = useState<boolean>(true)
  const newCancelToken = useCancelToken()

  const assetsToBeLoaded =
    (queryResult === undefined ? 0 : queryResult.totalResults) -
    (displayedAssets === undefined ? 0 : displayedAssets.length)

  const assetsToBeLoadedString = assetsToBeLoaded.toString()

  // callback function for page change
  const updatePage = useCallback((page: number) => {
    setDefaultParsed((currentQueryParams) => {
      return {
        ...currentQueryParams,
        page: page.toString()
      }
    })
  }, [])

  const fetchAssets = useDebouncedCallback(
    async (parsed: queryString.ParsedQuery<string>, chainIds: number[]) => {
      setLoading(true)
      const queryResult = await getResults(parsed, chainIds, newCancelToken())
      setDisplayAssets((currentList) => {
        if (parsed.page === undefined) {
          return queryResult.results
        }
        if (queryResult.results) {
          return [...currentList, ...queryResult.results]
        } else {
          return currentList
        }
      })
      setQueryResult(queryResult)

      setLoading(false)
    },
    500
  )

  useEffect(() => {
    if (chainIds) {
      fetchAssets(defaultParsed, chainIds)
    }
  }, [chainIds, fetchAssets, defaultParsed])

  const refScrollUp = useRef<HTMLDivElement>(null)

  const handleScrollUp = () => {
    if (refScrollUp.current) {
      refScrollUp.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {showOnboardingModule && (
        <Container>
          <OnboardingSection />
        </Container>
      )}

      <div ref={refScrollUp} className={styles.section}>
        <h3>FIWARE ASSETS</h3>
        <div id={styles.assetsList}>
          <AssetList
            assets={displayedAssets}
            defaultAssetNumber={12}
            isLoading={loading && displayedAssets.length === 0}
            showPagination={false}
            page={queryResult?.page}
            totalPages={queryResult?.totalPages}
          />
        </div>

        <div id={styles.buttonsGroup}>
          {queryResult && queryResult.page < queryResult.totalPages && (
            <Button
              className={styles.loadMoreButton}
              onClick={() => updatePage(queryResult.page + 1)}
              disabled={loading || queryResult.totalPages === queryResult.page}
            >
              {loading ? (
                <Loader message={`Loading...`} />
              ) : (
                `Load ${assetsToBeLoadedString} more`
              )}
            </Button>
          )}
          {displayedAssets.length !== 0 && queryResult.page !== 1 && (
            <Button
              onClick={() => {
                handleScrollUp()
                setDefaultParsed(initialQueryParams)
              }}
            >
              See less
            </Button>
          )}
        </div>

        <AllAssetsButton />
      </div>
      <About />
    </>
  )
}
