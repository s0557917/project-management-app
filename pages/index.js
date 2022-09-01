import Head from 'next/head';
import Header from '../components/general/authentication/Header';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Taskify</title>
        <meta name="description" content="Manage your tasks!" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Header />
    </div>
  )
}
