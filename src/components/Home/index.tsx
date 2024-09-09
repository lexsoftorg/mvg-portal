import { ReactElement, useCallback, useEffect, useState } from 'react'
import Button from '@shared/atoms/Button'
import { useUserPreferences } from '@context/UserPreferences'
import styles from './index.module.css'
// import HomeContent from './Content'
import Loader from '@components/@shared/atoms/Loader'

import SearchBar from '@components/Header/SearchBar'
import AssetList from '@components/@shared/AssetList'
import queryString from 'query-string'

import { getResults } from '@components/Search/utils'
import { useCancelToken } from '@hooks/useCancelToken'
import { useDebouncedCallback } from 'use-debounce'
import { Asset } from '@oceanprotocol/lib'
import { useSearchBarStatus } from '@context/SearchBarStatus'

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
  const { chainIds } = useUserPreferences()

  const [queryResult, setQueryResult] = useState<PagedAssets>()
  const [displayedAssets, setDisplayAssets] = useState<Asset[]>([])
  const [defaultParsed, setDefaultParsed] = useState<
    queryString.ParsedQuery<string>
  >({
    sort: 'nft.created',
    sortOrder: 'desc'
    // text: 'fiware'
  })
  const [loading, setLoading] = useState<boolean>(true)
  const newCancelToken = useCancelToken() // Utility for canceling requests

  console.log(queryResult)
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

  // Debounced function to fetch assets
  const fetchAssets = useDebouncedCallback(
    async (parsed: queryString.ParsedQuery<string>, chainIds: number[]) => {
      setLoading(true) // Set loading state
      const queryResult = await getResults(parsed, chainIds, newCancelToken()) // Call API
      setDisplayAssets((currentList) => {
        if (queryResult.results) {
          return [...currentList, ...queryResult.results]
        } else {
          return currentList
        }
      })
      setQueryResult(queryResult) // Set fetched data to state

      setLoading(false) // Reset loading state
    },
    500 // Debounce delay
  )

  useEffect(() => {
    // Fetch assets if chainIds are available
    if (chainIds) {
      fetchAssets(defaultParsed, chainIds) // Call the fetch function with defaults
    }
  }, [chainIds, fetchAssets, defaultParsed])

  return (
    <>
      {/* <SearchBar
        isSearchPage
        placeholder="Search for service offerings"
        // initialValue="fiware"
      /> */}
      <AllAssetsButton />
      <AssetList
        assets={displayedAssets}
        showPagination={false}
        page={queryResult?.page}
        totalPages={queryResult?.totalPages}
      />

      {queryResult &&
        queryResult.page < queryResult.totalPages && ( // Show button if more pages exist
          <Button
            size="small"
            style="primary"
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
    </>
  )
}
