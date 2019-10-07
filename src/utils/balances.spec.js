import { getCurrencyKeyUSDBalance, getCurrencyKeyBalance } from './balances';
import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from '../constants/currency';

const balances = {
	synths: {
		balances: {
			sBTC: {
				balance: 0.000628320060412509,
				usdBalance: 6.50700536879026,
			},
		},
		usdBalance: 6.50700536879026,
	},
	eth: {
		balance: 0.04243316499453552,
		usdBalance: 11.380247270217652,
	},
};

describe('Balances', () => {
	describe('getCurrencyKeyBalance', () => {
		it('returns the correct currency balance for ETH', () => {
			expect(getCurrencyKeyBalance(balances, CRYPTO_CURRENCY_MAP.ETH)).toEqual(0.04243316499453552);
		});

		it('returns the correct currency balance for sBTC', () => {
			expect(getCurrencyKeyBalance(balances, SYNTHS_MAP.sBTC)).toEqual(0.000628320060412509);
		});

		it('returns 0 from undefined currency', () => {
			expect(getCurrencyKeyBalance(balances, 'satoshiCoin')).toEqual(0);
		});

		it('returns 0 when balances is null or undefined', () => {
			expect(getCurrencyKeyBalance(null, CRYPTO_CURRENCY_MAP.ETH)).toEqual(0);
			expect(getCurrencyKeyBalance(undefined, CRYPTO_CURRENCY_MAP.ETH)).toEqual(0);
		});
	});

	describe('getCurrencyKeyUSDBalance', () => {
		it('returns the correct USD balance for ETH', () => {
			expect(getCurrencyKeyUSDBalance(balances, CRYPTO_CURRENCY_MAP.ETH)).toEqual(
				11.380247270217652
			);
		});

		it('returns the correct USD balance for sBTC', () => {
			expect(getCurrencyKeyUSDBalance(balances, SYNTHS_MAP.sBTC)).toEqual(6.50700536879026);
		});

		it('returns 0 from undefined currency', () => {
			expect(getCurrencyKeyUSDBalance(balances, 'magic')).toEqual(0);
		});

		it('returns 0 when balances is null or undefined', () => {
			expect(getCurrencyKeyUSDBalance(null, CRYPTO_CURRENCY_MAP.ETH)).toEqual(0);
			expect(getCurrencyKeyUSDBalance(undefined, CRYPTO_CURRENCY_MAP.ETH)).toEqual(0);
		});
	});
});
