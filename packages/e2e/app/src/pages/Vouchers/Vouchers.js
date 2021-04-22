import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';
import { shopperLocale } from '../../services/commonConfig';
import '../../style.scss';

window.checkout = new AdyenCheckout({
    clientKey: process.env.__CLIENT_KEY__,
    locale: shopperLocale,
    environment: 'test'
});

// Boleto Input
window.boletoInput = checkout
    .create('boletobancario', {
        ...window.boletoConfig
    })
    .mount('#boleto-input-container');
