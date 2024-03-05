/* eslint-disable react/prop-types */
import styles from "./GameNumber.module.css";

export const GameNumber = ({
  children,
  className,
}) => {
  return (
    <span className={`${styles.gameNumber} ${className || ""}`}>
      {children}
    </span>
  )
}