import React, { memo, FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';

import { OptionsMarket } from 'ducks/options/types';
import { RootState } from 'ducks/types';
import { getOptionsMarketsMap } from 'ducks/options/optionsMarkets';

import ROUTES, { navigateTo } from 'constants/routes';

import { GridDivCenteredCol, CenteredPageLayout, GridDivRow } from 'shared/commonStyles';

import { formatCurrencyWithSign, formatShortDate } from 'utils/formatters';

import Spinner from 'components/Spinner';
import Link from 'components/Link';
import { USD_SIGN } from 'constants/currency';
import MarketSentiment from '../components/MarketSentiment';
import ChartCard from './ChartCard';

const mapStateToProps = (state: RootState) => ({
	optionsMarketsMap: getOptionsMarketsMap(state),
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type MarketProps = PropsFromRedux &
	RouteComponentProps<{
		marketAddress: string;
	}>;

const Market: FC<MarketProps> = memo(({ match, optionsMarketsMap }) => {
	const [optionsMarket, setOptionsMarket] = useState<OptionsMarket | null>(null);
	const { t } = useTranslation();

	useEffect(() => {
		const { params } = match;
		// console.log(params);
		if (params && params.marketAddress && optionsMarketsMap[params.marketAddress]) {
			setOptionsMarket(optionsMarketsMap[params.marketAddress]);
		} else {
			navigateTo(ROUTES.Options.Home);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match]);

	return optionsMarket ? (
		<StyledCenteredPageLayout>
			<LeftCol>
				<Heading>
					<HeadingItem>
						<AllMarketsLink to={ROUTES.Options.Home}>
							{t('options.market.heading.all-markets')}
						</AllMarketsLink>
						{' | '}
						<HeadingTitle>
							{optionsMarket.asset} &gt;{' '}
							{formatCurrencyWithSign(USD_SIGN, optionsMarket.strikePrice)} @{' '}
							{formatShortDate(optionsMarket.maturityDate)}
						</HeadingTitle>
					</HeadingItem>
					<StyledHeadingItem>
						<HeadingTitle>{t('options.market.heading.market-sentiment')}</HeadingTitle>
						<StyledMarketSentiment
							short={optionsMarket.prices.short}
							long={optionsMarket.prices.long}
							display="col"
						/>
					</StyledHeadingItem>
				</Heading>
				<ChardContainer>
					<ChartCard optionsMarket={optionsMarket} />
				</ChardContainer>
			</LeftCol>
			<RightCol></RightCol>
		</StyledCenteredPageLayout>
	) : (
		<LoaderContainer>
			<Spinner size="sm" centered={true} />
		</LoaderContainer>
	);
});

// const Container = styled(GridDivCenteredCol)`
// 	grid-gap: 8px;
// `;

const StyledCenteredPageLayout = styled(CenteredPageLayout)`
	display: grid;
	grid-template-columns: 1fr auto;
`;

const LeftCol = styled(GridDivRow)`
	grid-gap: 8px;
	align-content: start;
`;

const Heading = styled(GridDivCenteredCol)`
	grid-gap: 8px;
	font-size: 12px;
	grid-template-columns: auto 1fr;
`;

const HeadingItem = styled(GridDivCenteredCol)`
	grid-gap: 8px;
	background-color: ${(props) => props.theme.colors.surfaceL3};
	height: 30px;
	padding: 0 12px;
`;

const StyledHeadingItem = styled(HeadingItem)`
	grid-template-columns: auto 1fr;
`;

const StyledMarketSentiment = styled(MarketSentiment)`
	font-size: 10px;
	font-family: ${(props) => props.theme.fonts.regular};
	.longs,
	.shorts {
		color: ${(props) => props.theme.colors.brand};
	}
	.percent {
		height: 8px;
	}
`;

const AllMarketsLink = styled(Link)`
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.fontSecondary};
`;

const HeadingTitle = styled.div`
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.fontPrimary};
`;

const ChardContainer = styled.div``;

const RightCol = styled.div`
	width: 414px;
`;

const LoaderContainer = styled.div`
	position: relative;
	height: 400px;
`;

export default connector(Market);
