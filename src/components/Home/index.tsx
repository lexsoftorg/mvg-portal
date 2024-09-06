import { ReactElement, useCallback, useEffect, useState } from 'react'
import Button from '@shared/atoms/Button'
import { generateBaseQuery, getFilterTerm } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { SortTermOptions } from '../../@types/aquarius/SearchQuery'
import SectionQueryResult from './SectionQueryResult'
import styles from './index.module.css'
import { useAddressConfig } from '@hooks/useAddressConfig'
import TopSales from './TopSales'
// import HomeContent from './Content'
import Ecosystem from './Ecosystem'
import OnboardingSection from '../@shared/Onboarding'
import Container from '../@shared/atoms/Container'

import SearchBar from '@components/Header/SearchBar'
import HomeContent from './Content'
import AssetList from '@components/@shared/AssetList'
import { useRouter } from 'next/router'
import queryString from 'query-string'

import { getResults } from '@components/Search/utils'
import { useCancelToken } from '@hooks/useCancelToken'
import { useDebouncedCallback } from 'use-debounce'
import { Asset } from '@oceanprotocol/lib'

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

  // maria

  //   useEffect(() => {
  //     const baseParams = {
  //       chainIds,
  //       esPaginationOptions: {
  //         size: 4
  //       },
  //       sortOptions: {
  //         sortBy: SortTermOptions.Created
  //       } as SortOptions
  //     } as BaseQueryParams

  //     const baseParamsSales = {
  //       chainIds,
  //       esPaginationOptions: {
  //         size: 4
  //       },
  //       sortOptions: {
  //         sortBy: SortTermOptions.Orders
  //       } as SortOptions
  //     } as BaseQueryParams

  //     setQueryRecent(generateBaseQuery(baseParams))
  //     setQueryMostSales(generateBaseQuery(baseParamsSales))

  //     if (hasFeaturedAssets()) {
  //       const featuredSections = featured.map((section) => ({
  //         title: section.title,
  //         query: generateBaseQuery({
  //           ...baseParams,
  //           esPaginationOptions: {
  //             size: section.assets.length
  //           },
  //           filters: [getFilterTerm('_id', section.assets)]
  //         })
  //       }))

  //       setQueryFeatured(featuredSections)
  //     }
  //   }, [chainIds, featured, hasFeaturedAssets])

  const [queryResult, setQueryResult] = useState<PagedAssets>()
  const [displayedAssets, setDisplayAssets] = useState<Asset[]>([])
  const [defaultParsed, setDefaultParsed] = useState<
    queryString.ParsedQuery<string>
  >({
    sort: 'nft.created',
    sortOrder: 'desc'
  })
  const [loading, setLoading] = useState<boolean>(true)
  const newCancelToken = useCancelToken() // Utility for canceling requests

  // callback function for page change
  const updatePage = useCallback((page: number) => {
    setDefaultParsed((currentQueryParams) => {
      return {
        ...currentQueryParams,
        page: page.toString()
      }
    })
  }, [])

  console.log('displayed: ', displayedAssets)

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
      <SearchBar
        isSearchPage
        placeholder="Search for service offerings"
        // initialValue="fiware"
      />
      <AssetList
        assets={displayedAssets}
        showPagination={false}
        isLoading={loading}
        page={queryResult?.page}
        totalPages={queryResult?.totalPages}
      />
      {/* <button onClick={() => updatePage(queryResult.page + 1)}>
        Load more
      </button> */}
      {queryResult &&
        queryResult.page < queryResult.totalPages && ( // Show button if more pages exist
          <button
            onClick={() => updatePage(queryResult.page + 1)}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      {/* <SectionQueryResult title="Maria"  /> */}

      {/* {showOnboardingModule && (
        <Container>
          <OnboardingSection />
        </Container>
      )} */}
      {/* <Ecosystem /> */}
      {/* <TopSales title="Publishers With Most Sales" /> */}
      {/* <HomeContent /> */}
      {/* {hasFeaturedAssets() && (
        <>
          {queryFeatured.map((section, i) => (
            <SectionQueryResult
              key={`${section.title}-${i}`}
              title={section.title}
              query={section.query}
            />
          ))}
        </>
      )} */}
      {/* <SectionQueryResult title="Recently Published" query={queryRecent} /> */}
      {/* <SectionQueryResult title="Most Sales" query={queryMostSales} /> */}
      {/* <AllAssetsButton /> */}
    </>
  )
}
