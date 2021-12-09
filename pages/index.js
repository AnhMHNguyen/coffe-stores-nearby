import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Banner from '../components/banner'
import Card from '../components/card'
import useTrackLocation from '../hooks/use-track-location'
import { fetchCoffeeStores } from '../lib/coffee-store'
import { ACTION_TYPES, useStoreContext} from '../store/store-context'
import styles from '../styles/Home.module.scss'

export const getStaticProps = async () => {
  const coffeeStoresData = await fetchCoffeeStores();
  return {
    props: {
      coffeeStoresData
    },
  }
}

export default function Home({ coffeeStoresData }) {
  const { handleTrackLocation, locationError, isFindingLocation } = useTrackLocation();
  const { state, dispatch } = useStoreContext();
  const { coffeeStores, latLong } = state;
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const bannerOnClick = () => {
    handleTrackLocation();
  }
  
  useEffect(() => {
    const fetchData = async (ll) => {
      try {
        const fetchedResponse = await fetch(`/api/getCoffeeStoresByLocation?latLong=${ll}&limit=30`)
        const fetchedData = await fetchedResponse.json()
        dispatch({
          type: ACTION_TYPES.SET_COFFEE_STORES,
          payload: {coffeeStores: fetchedData}
        })
        setCoffeeStoresError("");
      } catch (err) {
        console.error(err)
        setCoffeeStoresError(err.message);
      }
    }
    if (latLong) {
      fetchData(latLong);
    }
  },[latLong, dispatch])

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner handleOnClick={bannerOnClick} buttonText={isFindingLocation ? "Locating..." : "View stores nearby"} />
        {locationError && <p>Something went wrong: {locationError}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage} >
          <Image src="/static/hero-image.png" alt="hero-image" width={300} height={300}/>
        </div>
        {coffeeStores.length > 0 && (
        <div className={styles.sectionWrapper}>
          <h2 className={styles.heading2}>Stores Near Me</h2>
          <div className={styles.cardLayout}>
            {coffeeStores.map((store) => (
              <Card
                key={store.id}
                store={store}
              />
            ))}
          </div>
        </div>
        )}
        
        {coffeeStoresData.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStoresData.map((store) => (
                <Card
                  key={store.id}
                  store={store}
                />
              ))}
            </div>
            </div>
        )}
      </main>
    </div>
  )
}
