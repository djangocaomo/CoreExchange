import React, { useRef } from 'react';
import styled, { withTheme } from 'styled-components';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import { debounce } from 'lodash';

import { DataSmall } from '../Typography';
import { Table, Tr, Thead, Tbody, Th, Td, DataLabel } from '../Table';
import { formatCurrency } from '../../utils/formatters';
import Spinner from '../Spinner';

const SCROLL_THRESHOLD = 0.8;

const getPrecision = amount => {
	if (amount >= 1) {
		return 2;
	} else return 4;
};

const getPrice = (toAmountInUSD, toAmount, toCurrencyKey, fromAmountInUSD, fromAmount) => {
	const price = toCurrencyKey === 'sUSD' ? fromAmountInUSD / fromAmount : toAmountInUSD / toAmount;
	return formatCurrency(price, getPrecision(price));
};

const getAmount = (toAmount, toCurrencyKey, fromAmount) => {
	const amount = toCurrencyKey === 'sUSD' ? fromAmount : toAmount;
	return formatCurrency(amount, getPrecision(amount));
};

const getTotal = (toAmountInUSD, toCurrencyKey, fromAmountInUSD) => {
	const amount = toCurrencyKey === 'sUSD' ? fromAmountInUSD : toAmountInUSD;
	return formatCurrency(amount, getPrecision(amount));
};

const PastTransactions = ({
	theme: { colors },
	transactions: { list, loading },
	onScrollPaging,
}) => {
	const tbodyEl = useRef(null);

	const onTableScroll = () => {
		if (loading) return;
		checkScroll();
	};

	const checkScroll = debounce(() => {
		if (!tbodyEl.current) return;

		const { scrollTop, scrollHeight, clientHeight } = tbodyEl.current;
		if (scrollTop + clientHeight > SCROLL_THRESHOLD * scrollHeight) {
			onScrollPaging();
		}
	}, 200);

	return (
		<>
			<Table cellSpacing="0">
				<Thead>
					<Tr>
						{['Date | Time', 'Pair', 'Price', 'Amount', 'Total', 'View'].map((label, i) => {
							return (
								<Th key={i}>
									<ButtonSort>
										<DataSmall color={colors.fontTertiary}>{label}</DataSmall>
										{/* <SortIcon src={'/images/sort-arrows.svg'} /> */}
									</ButtonSort>
								</Th>
							);
						})}
					</Tr>
				</Thead>
				<Tbody
					style={{ transition: 'opacity ease-in-out .1s', opacity: loading ? 0.25 : 1 }}
					ref={tbodyEl}
					onScroll={onTableScroll}
				>
					{list.map(t => {
						return (
							<Tr key={t.hash}>
								<Td>
									<DataLabel style={{ whiteSpace: 'nowrap' }}>
										{format(t.timestamp, 'DD-MM-YY | HH:mm')}
									</DataLabel>
								</Td>
								<Td>
									<DataLabel>
										{t.toCurrencyKey}/{t.fromCurrencyKey}
									</DataLabel>
								</Td>
								<Td>
									<DataLabel>
										$
										{getPrice(
											t.toAmountInUSD,
											t.toAmount,
											t.toCurrencyKey,
											t.fromAmountInUSD,
											t.fromAmount
										)}
									</DataLabel>
								</Td>
								<Td>
									<DataLabel>{getAmount(t.toAmount, t.toCurrencyKey, t.fromAmount)}</DataLabel>
								</Td>
								<Td>
									<DataLabel>
										${getTotal(t.toAmountInUSD, t.toCurrencyKey, t.fromAmountInUSD)}
									</DataLabel>
								</Td>

								<Td>
									<DataLabel>
										<Link href={`https://etherscan.io/tx/${t.hash}`} target="_blank">
											VIEW
										</Link>
									</DataLabel>
								</Td>
							</Tr>
						);
					})}
				</Tbody>
			</Table>
			{loading ? <CenteredSpinner size="big" /> : null}
		</>
	);
};

const ButtonSort = styled.button`
	text-align: left;
	display: flex;
	align-items: center;
	border: none;
	outline: none;
	cursor: pointer;
	background-color: transparent;
	padding: 0;
`;
const CenteredSpinner = styled(Spinner)`
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -20px;
	margin-left: -41px;
	transform: scale(0.5);
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Link = styled.a`
	letter-spacing: 0.2px;
	color: ${props => props.theme.colors.hyperLink};
	&:hover {
		text-decoration: underline;
	}

	text-decoration: none;
`;

const mapStateToProps = () => {
	return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PastTransactions));
