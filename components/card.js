import Link from 'next/link'
import Image from 'next/image'
import cls from 'classnames'
import styles from './card.module.scss'

const Card = ({ store }) => {
  return (
    <div className={ cls("glass",styles.cardContainer)}>
      <Link href={`/coffee-store/${store.id}`}>
        <a className={styles.container}>
            <div className={styles.cardImageWrapper}>
              <Image className={styles.cardImage} src={store.imgUrl} width={260} height={160} alt={store.name} />
            </div>
            <div className={styles.cardHeaderWrapper}>
              <h3 className={styles.cardHeader}>{store.name}</h3>
            </div>
        </a>
      </Link>
    </div>
  )
}

export default Card