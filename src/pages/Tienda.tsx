import React, { useState } from 'react';
import './Tienda.css';
import OverlayNotification from '../components/OverlayNotification';

// --- CAMBIO 1: Importamos tus nuevas imágenes ---
import coinIcon from '../assets/monedas.png';
import capybaraMascot from '../assets/capybara-coin-master.jpg';

const coinPacks = [
    { id: 1, coins: 100, price: 3.50, gradient: 'linear-gradient(135deg, #68E4A9 0%, #39D391 100%)' },
    { id: 2, coins: 550, price: 15.00, gradient: 'linear-gradient(135deg, #6B99FE 0%, #4B77F6 100%)' },
    { id: 3, coins: 1200, price: 30.00, gradient: 'linear-gradient(135deg, #C573F8 0%, #A445E6 100%)' },
    { id: 4, coins: 2500, price: 60.00, gradient: 'linear-gradient(135deg, #FF9B51 0%, #F87B25 100%)' },
];

interface Pack {
    id: number;
    coins: number;
    price: number;
    gradient: string;
}

const Tienda = () => {
    const COIN_PRICE = 0.035; // precio base por moneda en soles (sin paquete)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [overlayMessage, setOverlayMessage] = useState<string | null>(null);
    const [customCoins, setCustomCoins] = useState(500);

    const handleOpenModal = (pack: Pack) => {
        setSelectedPack(pack);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPack(null);
    };
    
    const handlePurchase = (event: React.FormEvent) => {
        event.preventDefault();
        handleCloseModal();
        if (selectedPack) {
            setOverlayMessage(`Compra realizada: ${selectedPack.coins.toLocaleString()} monedas por S/ ${selectedPack.price.toFixed(2)}.`);
        } else {
            setOverlayMessage("¡Compra realizada con éxito! Tu comprobante ha sido enviado.");
        }
        setShowSuccess(true);
    };

    const handleCustomPurchase = (event: React.FormEvent) => {
        event.preventDefault();
        const coins = Math.max(1, Number(customCoins) || 0);
        const customPack: Pack = {
            id: -1,
            coins,
            price: parseFloat((coins * COIN_PRICE).toFixed(2)),
            gradient: 'linear-gradient(135deg, #3f3f50 0%, #2b2b36 100%)'
        };
        setCustomCoins(coins);
        handleOpenModal(customPack);
    };

    return (
        <div className="tienda-container">
            <div className="tienda-header">
                {/* --- CAMBIO 2: Añadimos la imagen del carpincho --- */}
                <img src={capybaraMascot} alt="Mascota de la Tienda" className="tienda-mascot-img" />
                <div className="tienda-header-text">
                    <h1 className="tienda-title">¡La Capibara-Tienda!</h1>
                    <p className="tienda-subtitle">Recarga tus monedas y conviértete en el próximo Coin Master.</p>
                </div>
            </div>

            <div className="packs-grid">
                {coinPacks.map((pack) => (
                    <div key={pack.id} className="pack-card" onClick={() => handleOpenModal(pack)}>
                        <div className="pack-card-inner" style={{ background: pack.gradient }}>
                            <div className="shine-effect"></div>
                            {/* El ícono de moneda ahora es tu imagen */}
                            <img src={coinIcon} alt="Monedas" className="pack-icon" />
                            <div className="pack-coins">{pack.coins.toLocaleString()}</div>
                            <div className="pack-label">monedas</div>
                            <div className="pack-price-button">
                                Comprar por S/ {pack.price.toFixed(2)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="custom-purchase">
                <div className="custom-card">
                    <div className="custom-title">Compra exacta en Soles</div>
                    <p className="custom-subtitle">Elige la cantidad exacta de monedas que necesitas sin depender de un paquete.</p>
                    <form className="custom-form" onSubmit={handleCustomPurchase}>
                        <label htmlFor="custom-coins">Monedas a comprar</label>
                        <input
                            id="custom-coins"
                            type="number"
                            min={1}
                            value={customCoins}
                            onChange={(e) => setCustomCoins(Number(e.target.value))}
                        />
                        <div className="custom-price">
                            Total: <span>S/ {(Math.max(0, customCoins) * COIN_PRICE).toFixed(2)}</span>
                        </div>
                        <button type="submit" className="purchase-button">Comprar ahora</button>
                    </form>
                </div>
            </div>

            {/* El código del modal y la notificación no cambia */}
            {isModalOpen && selectedPack && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={handleCloseModal} className="modal-close-button">&times;</button>
                        <h2>Confirmar Compra</h2>
                        <p>Estás comprando <strong>{selectedPack.coins.toLocaleString()} monedas</strong> por <strong>S/ {selectedPack.price.toFixed(2)}</strong>.</p>
                        
                        <form onSubmit={handlePurchase} className="payment-form">
                            <label htmlFor="card-name">Nombre en la tarjeta</label>
                            <input id="card-name" type="text" placeholder="Juan Pérez" required />
                            <label htmlFor="card-number">Número de tarjeta</label>
                            <input id="card-number" type="text" placeholder="4242 4242 4242 4242" required />
                            <div className="form-row">
                                <div>
                                    <label htmlFor="card-expiry">Expiración</label>
                                    <input id="card-expiry" type="text" placeholder="MM/AA" required />
                                </div>
                                <div>
                                    <label htmlFor="card-cvc">CVC</label>
                                    <input id="card-cvc" type="text" placeholder="123" required />
                                </div>
                            </div>
                            <button type="submit" className="purchase-button">Pagar Ahora</button>
                        </form>
                    </div>
                </div>
            )}
            {showSuccess && overlayMessage && (
                <OverlayNotification
                    message={overlayMessage}
                    onClose={() => { setShowSuccess(false); setOverlayMessage(null); }}
                />
            )}
        </div>
    );
};

export default Tienda;
