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

  return (
    <>
      <Head>
        <title>autocomplete</title>
        <meta name="description" content="autocomplete" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={inter.className}>
        <form onSubmit={onSubmit} className={styles.searchForm}>
          <input
            className={styles.searchBar}
            type="text"
            placeholder="Search for keywords..."
            value={searchQuery}
            onChange={onInputChange}
          />
          <button
            className={styles.searchButton}
            type="submit"
            disabled={isLoading || !searchQuery}
          >
            Search
          </button>
        </form>
        <div className="results">
          {isLoading && <h3>Loading...</h3>}
          {showResults &&
            Object.keys(keywords).map((keywordSource) => {
              if (keywords[keywordSource].length === 0) {
                return null;
              }

              return (
                <React.Fragment key={keywordSource}>
                  <h3>{capitalize(keywordSource)}</h3>
                  {keywords[keywordSource]?.map((keyword) => (
                    <Keyword title={keyword} key={keyword} />
                  ))}
                </React.Fragment>
              );
            })}
        </div>
      </main>
    </>
  );
}
