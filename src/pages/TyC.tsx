import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TyC.module.css"; // Usaremos CSS Modules para los estilos

const TyC: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.tycContainer}>
      <h2 className={styles.title}>Términos y Condiciones de Liky</h2>
      <p className={styles.lastUpdated}>Última actualización: 17 de Octubre, 2025</p>

      <div className={styles.section}>
        <h3>1. Aceptación de los Términos</h3>
        <p>
          Al acceder o utilizar nuestra plataforma ("Liky"), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al servicio.
        </p>
      </div>

      <div className={styles.section}>
        <h3>2. Cuentas de Usuario</h3>
        <p>
          Para acceder a ciertas funciones, como comprar monedas o interactuar en los chats, debe crear una cuenta. Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran en su cuenta. Debe ser mayor de 13 años para crear una cuenta.
        </p>
      </div>

      <div className={styles.section}>
        <h3>3. Moneda Virtual y Regalos</h3>
        <p>
          Liky ofrece una moneda virtual ("Monedas") que puede ser comprada y utilizada para enviar regalos virtuales a los streamers. La compra de Monedas es final y no reembolsable. Las Monedas y los regalos no tienen valor monetario en el mundo real y no pueden ser canjeados por dinero en efectivo.
        </p>
      </div>

      <div className={styles.section}>
        <h3>4. Código de Conducta</h3>
        <p>
          Usted se compromete a no utilizar la plataforma para publicar contenido que sea ilegal, ofensivo, amenazante, difamatorio o que viole los derechos de terceros. El acoso, el spam y cualquier forma de comportamiento tóxico no serán tolerados y pueden resultar en la suspensión o terminación de su cuenta.
        </p>
      </div>
      
      <div className={styles.section}>
        <h3>5. Contenido del Streamer</h3>
        <p>
          Los streamers son los únicos responsables del contenido que transmiten. Liky no respalda ni se hace responsable del contenido generado por los usuarios. Nos reservamos el derecho de eliminar contenido o suspender cuentas que violen nuestras políticas.
        </p>
      </div>

      <div className={styles.section}>
        <h3>6. Terminación de la Cuenta</h3>
        <p>
          Podemos suspender o cancelar su acceso a la plataforma de inmediato, sin previo aviso ni responsabilidad, por cualquier motivo, incluido el incumplimiento de estos Términos.
        </p>
      </div>

      <button className={styles.backButton} onClick={() => navigate(-1)}>
        Regresar
      </button>
    </div>
  );
};

export default TyC;