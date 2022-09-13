import Head from 'next/head';
import Header from '../components/general/authentication/Header';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Taskify</title>
        <meta name="description" content="Manage your tasks!" />
      </Head>
      <Header />
    </div>
  )
}
