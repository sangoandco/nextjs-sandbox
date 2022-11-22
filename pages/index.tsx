import Head from 'next/head';
import styles from '../styles/Home.module.css';
import callAPI from './api/callAPI';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Key } from 'react';

export default function Home({ launches }) {

  console.log('launches: ', launches )
  console.log('API: ', callAPI())
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        
      <div className={styles.grid}>
        {launches.map((launch: { 
          id: Key; 
          links: { 
            video_link: string | undefined;
            mission_patch: string | undefined;
          };
          mission_name: string| undefined;
          launch_date_local: Date; 
        }) => {
          return (
            <>
              <a key={launch.id} href={launch.links.video_link} className={styles.card}>
              <img
                src={launch.links.mission_patch}
                width="auto"
                height="42"
                className=""
                alt=""
              />
              <h3>{ launch.mission_name }</h3>
                <p><strong>Launch Date:</strong> { new Date(launch.launch_date_local).toLocaleDateString("en-US") }</p>
              </a>
            </>
          );
        })}
      </div>
				<button onClick={callAPI}>Make API Call</button>
			  
      </main>
    </div>
  )
}

export async function getStaticProps() {

  const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql/',
    cache: new InMemoryCache()
  });

  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 10) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }
    `
  });

  return {
    props: {
      launches: data.launchesPast
    }
  }
}