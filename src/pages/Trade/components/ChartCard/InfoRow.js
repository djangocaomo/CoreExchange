import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { SYNTHS_MAP } from 'constants/currency';

import { getSynthPair, getAvailableSynthsMap } from 'ducks/synths';
import { getRatesExchangeRates } from 'ducks/rates';

import { InfoBox, InfoBoxLabel, InfoBoxValue } from 'shared/commonStyles';
import { formatCurrencyWithPrecision, formatCurrencyWithSign } from 'utils/formatters';
import { getExchangeRatesForCurrencies } from 'utils/rates';

import ChangePercent from 'components/ChangePercent';

const InfoRow = ({
	data: { low24H, high24H, change24H, volume24H },
	exchangeRates,
	synthPair: { base, quote },
	synthsMap,
}) => {
	const { t } = useTranslation();
	const rate = getExchangeRatesForCurrencies(exchangeRates, base.name, quote.name) || 0;
	const synthSign = synthsMap[quote.name] && synthsMap[quote.name].sign;
	const [prevRate, setPrevRate] = useState(rate);
	const [rateChange, setRateChange] = useState(0);

	useEffect(() => {
		if (rate > 0 && prevRate > 0) {
			if (rate > prevRate) {
				setRateChange(1);
			} else if (rate < prevRate) {
				setRateChange(-1);
			} else {
				setRateChange(0);
			}
		}
		setPrevRate(rate);
		// eslint-disable-next-line
	}, [rate]);

	useEffect(() => {
		setPrevRate(rate);
		setRateChange(0);
		// eslint-disable-next-line
	}, [base.name, quote.name]);

	const infoBoxItems = [
		{
			label: t('trade.chart-card.info-boxes.24h-change'),
			value: <ChangePercent value={change24H} />,
		},
		{
			label: t('trade.chart-card.info-boxes.24h-high'),
			value: formatCurrencyWithSign(synthSign, high24H),
		},
		{
			label: t('trade.chart-card.info-boxes.24h-low'),
			value: formatCurrencyWithSign(synthSign, low24H),
		},
		{
			label: t('trade.chart-card.info-boxes.24h-volume'),
			value: formatCurrencyWithSign(synthsMap[SYNTHS_MAP.sUSD].sign, volume24H),
		},
	];
	return (
		<RowContainer>
			<InfoBox>
				<InfoBoxLabel>{t('trade.chart-card.info-boxes.price')}</InfoBoxLabel>
				<InfoBoxValue rateChange={rateChange}>{`${synthSign}${formatCurrencyWithPrecision(
					rate
				)}`}</InfoBoxValue>
			</InfoBox>
			{infoBoxItems.map(({ label, value }, id) => (
				<InfoBox key={`chartInfo-${id}`}>
					<InfoBoxLabel>{label}</InfoBoxLabel>
					<InfoBoxValue>{value}</InfoBoxValue>
				</InfoBox>
			))}
		</RowContainer>
	);
};

const RowContainer = styled.div`
	margin-top: 2px;
	display: grid;
	grid-column-gap: 12px;
	grid-auto-flow: column;
`;

const mapStateToProps = (state) => ({
	synthPair: getSynthPair(state),
	exchangeRates: getRatesExchangeRates(state),
	synthsMap: getAvailableSynthsMap(state),
});

export default connect(mapStateToProps, null)(InfoRow);
