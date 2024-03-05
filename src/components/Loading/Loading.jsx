import styles from "./Loading.module.css";

export const Loading = () => {
  return (
    <span className={styles.container}>
      <span className={styles.loading}>
        <span className={styles.innerLoading} />
      </span>
    </span>
  )
}