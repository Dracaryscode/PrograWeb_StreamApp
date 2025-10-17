import { useMemo } from 'react'
import styles from './GiftShopModal.module.css'

export type Gift = {
  id: string
  name: string
  price: number  
  emoji: string 
}

type Props = {
  open: boolean
  balance: number
  gifts: Gift[]
  onClose: () => void
  onSend: (gift: Gift) => void
  onGetKpoints?: () => void
}

export default function GiftShopModal({
  open, balance, gifts, onClose, onSend, onGetKpoints
}: Props) {
  const basic = useMemo(() => gifts.slice(0, 6), [gifts])
  if (!open) return null

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="Tienda de K Puntos">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Regalos</h3>
          <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className={styles.subheader}>
          <span className={styles.muted}>Dar Regalos</span>
          <button className={styles.getKpoints} onClick={onGetKpoints}>Obtener L Puntos</button>
        </div>

        <div className={styles.sectionTitle}>Regalos Basicos</div>

        <div className={styles.grid}>
          {basic.map(g => (
            <button
              key={g.id}
              className={styles.giftCard}
              onClick={() => onSend(g)}
              title={`Send ${g.name}`}
            >
              <div className={styles.giftEmoji}>{g.emoji}</div>
              <div className={styles.giftName}>{g.name}</div>
              <div className={styles.priceRow}>
                <span className={styles.k}>L</span>
                <span>{g.price}</span>
              </div>
            </button>
          ))}
        </div>

        <div className={styles.balance}>
          <span className={styles.k}>L</span>
          <strong>{balance}</strong>
        </div>
      </div>
    </div>
  )
}
