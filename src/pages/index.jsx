import React, { useState } from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';

import { Keyword } from '@/components/Keyword';
import { useKeywordsQuery } from '@/components/hooks/useKeywordsQuery';
import { capitalize } from '@/utils/capitalize';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { fetch, isLoading, isFetched, keywords } = useKeywordsQuery({ searchQuery });

  const onInputChange = (evt) => setSearchQuery(evt.target.value);

  const onSubmit = async (evt) => {
    evt.preventDefault();
    await fetch();
  };

  const showResults = isFetched && !isLoading;

  async function handleCopyAllKeywords(keywords) {
    const allKeywords = Object.values(keywords).flat();

    navigator.clipboard.writeText(allKeywords.join('\n')).then(() => {
      alert(`Copied ${allKeywords.length} keywords from all retailers to clipboard`);
    });
  }

  async function handleCopyOfRetailer(retailer) {
    // only copy the keywords of the retailer to clipboard

    const retailerKeywords = Object.values(keywords[retailer]).flat();

    navigator.clipboard.writeText(retailerKeywords.join('\n')).then(() => {
      alert(`Copied ${retailerKeywords.length} keywords from ${retailer} to clipboard`);
    });
  }

  return (
    <>
      <Head>
        <title>autocomplete</title>
        <meta name="description" content="autocomplete" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={inter.className}>
        <div className={styles.content}>
          <p className={styles.PageTitle}>AutoCompleteKeyword.com</p>
          <h1 className={styles.Heading}>
            Instant Keyword Lists <br /> Built from Retailer&apos;s Autocomplete Results
          </h1>
          <div className={styles.searchCard}>
            <form onSubmit={onSubmit} className={styles.searchForm}>
              <input
                className={styles.searchBar}
                type="text"
                placeholder="Enter Keyword"
                value={searchQuery}
                onChange={onInputChange}
              />
              <button
                className={styles.searchButton}
                type="submit"
                disabled={isLoading || !searchQuery}
              >
                Get Keywords
              </button>
            </form>
            <div className={styles.results}>
              {isLoading && <h3 className={styles.loadingHeader}>Loading...</h3>}
              {showResults && (
                <div className={styles.resultRowContainer}>
                  {Object.keys(keywords).map((keywordSource, index) => {
                    if (keywords[keywordSource].length === 0) {
                      return null;
                    }
                    return (
                      <div key={index} className={styles.resultCard}>
                        <h3 className={styles.resultCardHeading}>{capitalize(keywordSource)}</h3>
                        <div className={styles.resultCardKeywordContainer}>
                          {keywords[keywordSource]?.map((keyword) => (
                            <Keyword title={keyword} key={keyword} />
                          ))}
                        </div>
                        <button
                          className={styles.copyButton}
                          onClick={() => {
                            handleCopyOfRetailer(keywordSource);
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {showResults && (
                <button
                  className={styles.copyAllButton}
                  onClick={() => {
                    handleCopyAllKeywords(keywords);
                  }}
                >
                  Copy all Keywords
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
