import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import cls from "classnames";
import useSWR from "swr";
import { fetchCoffeeStores } from "../../lib/coffee-store";
import { useStoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils";
import styles from '../../styles/coffee-store.module.scss';

export const getStaticProps = async ({ params }) => {
  const coffeeStores = await fetchCoffeeStores();
  const store = coffeeStores.find(store => store.id.toString() === params.id);
  return {
    props: {
      coffeeStoreData: store ? store : {},
    }
  }
}

export const getStaticPaths = async () => {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map(store => {
    return {
      params: {
        id: store.id.toString(),
      }
    }
  })
  return {
    paths,
    fallback: true,
  }
}

const CoffeeStore = ({coffeeStoreData}) => {
  const router = useRouter();
  const id = router.query.id;
  const [coffeeStore, setCoffeeStore] = useState(coffeeStoreData);
  const { state: { coffeeStores } } = useStoreContext();
  
  const handleCreateCoffeeStore = async (store) => {
    try {
      const { id, name, imgUrl, neighbourhood, address, voting } = store;
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighbourhood || "",
          address: address || ""
        })
      });
      const dbCoffeeStore = await response.json();
      // console.log({ dbCoffeeStore });
    } catch (err) {
      console.error('Error creating coffee store', err)
    }
  }
  
  useEffect(() => {
    if (isEmpty(coffeeStoreData)) {
      if (coffeeStores.length > 0) {
        const store = coffeeStores.find(store => store.id.toString() === id);
        if (store) {
          setCoffeeStore(store);
          handleCreateCoffeeStore(store);
        }
      }
    } else {
      handleCreateCoffeeStore(coffeeStoreData);
    }
    
  }, [coffeeStoreData, coffeeStores, id])

  const [votingCount, setVotingCount] = useState(0);
  const fetcher = url => fetch(url).then(res => res.json())
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting)
    }
  },[data])
  
  if (error) {
    return <div>Something went wrong while retrieving coffee store page</div>;
  }
  
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  
  const handleUpVoteBtn = async () => {
    try {
      const response = await fetch('/api/favouriteCoffeeStoreById', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
        })
      });
      const dbCoffeeStore = await response.json();
      // console.log({ dbCoffeeStore });
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count)
      }
    } catch (err) {
      console.error('Error upvoting coffee store', err)
    }
  }

  
  return (
    <div className={styles.layout}>
      <Head>
        <title>{coffeeStore.name}</title>
        <meta name="description" content={`${coffeeStore.name} coffee store`}></meta>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.link}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
          <h2 className={styles.name}>{coffeeStore.name}</h2>
          <div className={styles.storeImgWrapper}>
            <Image className={styles.storeImg} src={
              coffeeStore.imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            } width={600} height={360} alt={coffeeStore.name} />
          </div>
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width="24" height="24" alt=""/>
            <p className={styles.text}>{coffeeStore.address}</p>
          </div>
          {coffeeStore.neighbourhood &&
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width="24" height="24" alt=""/>
              <p className={styles.text}>{coffeeStore.neighbourhood}</p>
            </div>
          }
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24" alt=""/>
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upVoteBtn} onClick={handleUpVoteBtn}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoffeeStore;