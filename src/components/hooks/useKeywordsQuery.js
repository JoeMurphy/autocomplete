import { useQueries } from '@tanstack/react-query';

import { capitalize } from '@/utils/capitalize';

export const fetchKeywords = async ({ queryKey }) => {
  const [_key, { searchQuery, searchSource }] = queryKey;
  const url = `/api/keywords?source=${searchSource}&q=${searchQuery}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to fetch keywords from ${capitalize(searchSource)}`);
  }

  const result = await response.json();

  return result;
};

const sources = ['walmart', 'target', 'google', 'amazon'];

export const useKeywordsQuery = ({ searchQuery }) => {
  const [walmartQuery, targetQuery, googleQuery, amazonQuery] = useQueries({
    queries: sources.map((source) => ({
      queryKey: [`${source}-keywords`, { searchQuery, searchSource: source }],
      queryFn: fetchKeywords
    }))
  });

  const fetch = async () => {
    const queries = [
      walmartQuery.refetch,
      targetQuery.refetch,
      googleQuery.refetch,
      amazonQuery.refetch
    ];

    for (let query of queries) {
      await query();
    }
  };

  const isLoading = [
    walmartQuery.fetchStatus,
    targetQuery.fetchStatus,
    googleQuery.fetchStatus,
    amazonQuery.fetchStatus
  ].some((fetchStatus) => fetchStatus === 'fetching');

  const isFetched = [
    walmartQuery.isFetched,
    targetQuery.isFetched,
    googleQuery.isFetched,
    amazonQuery.isFetched
  ].every((isFetched) => isFetched);

  const keywords = {
    walmart: walmartQuery?.data || [],
    target: targetQuery?.data || [],
    google: googleQuery?.data || [],
    amazon: amazonQuery?.data || []
  };

  return { fetch, keywords, isFetched, isLoading };
};
