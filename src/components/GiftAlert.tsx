import { useEffect } from "react";
import styles from "./GiftAlert.module.css";
import type { GiftUI } from "../pages/Stream/GiftShopModal";

interface GiftAlertProps {
  user: string;
  gift: GiftUI;
  onDone: () => void;
}

const GiftAlert: React.FC<GiftAlertProps> = ({ user, gift, onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 5000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={styles.alertContainer}>
      <div className={styles.confetti}></div>
      <div className={styles.confetti}></div>
      <div className={styles.confetti}></div>
      <div className={styles.giftEmoji}>{gift.emoji ?? "🎁"}</div>
      <div className={styles.textContainer}>
        <span className={styles.user}>{user}</span>
        <span className={styles.action}>ha enviado un regalo:</span>
      </div>
      <div className={styles.giftName}>{gift.nombre}</div>
    </div>
  );
};

export default GiftAlert;
