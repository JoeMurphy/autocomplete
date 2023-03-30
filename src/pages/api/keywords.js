import { unique } from '@/utils/unique';

const KEYWORD_SOURCES = {
  WALMART: 'https://www.walmart.com/typeahead/v3/complete?term=[query]',
  TARGET:
    'https://typeahead.target.com/autocomplete/TypeAheadSearch/v2?channel=web&ctgryVal=0%7CALL%7Cmatchallpartial%7Call+categories&q=[query]',
  GOOGLE: 'http://google.com/complete/search?client=chrome&q=[query]',
  AMAZON:
    'https://completion.amazon.com/api/2017/suggestions?limit=11&prefix=[query]&suggestion-type=WIDGET&suggestion-type=KEYWORD&page-type=Search&alias=aps&site-variant=desktop&version=3&event=onkeypress&wc=&lop=en_US&avg-ks-time=427&fb=1&session-id=143-9744996-1108124&request-id=QKZBXH6QFEZPYZG6D77W&mid=ATVPDKIKX0DER&plain-mid=1&client-info=amazon-search-ui'
};

const formatKeywordResult = (source, keywordResults) => {
  switch (source) {
    case 'WALMART': {
      return unique(keywordResults.queries.map((result) => result.displayName));
    }
    case 'TARGET': {
      return unique(keywordResults.suggestions.map((result) => result.label));
    }
    case 'GOOGLE': {
      const [, keywords] = keywordResults;
      return unique(keywords);
    }
    case 'AMAZON': {
      return unique(keywordResults.suggestions.map((result) => result.value));
    }
    default: {
      return null;
    }
  }
};

export default async function handler(req, res) {
  if (!req.query || !req.query.q || !req.query.source) {
    return res.status(500);
  }

  const source = req.query.source.toUpperCase();
  const sourceUrl = KEYWORD_SOURCES[source].replace('[query]', req.query.q);

  const response = await fetch(sourceUrl);

  if (!response.ok) {
    res.status(500);
  }

  try {
    const result = await response.json();
    const formattedResult = formatKeywordResult(source, result);

    return res.status(200).send(formattedResult);
  } catch (err) {
    return res.status(500);
  }
}
