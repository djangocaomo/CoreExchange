import React, { FC, useContext, useMemo } from 'react';
import ReactSelect, { Props, StylesConfig } from 'react-select';
import { ThemeContext } from 'styled-components';

const IndicatorSeparator: FC = () => null;

function Select<T>(props: Props<T>) {
	const { colors } = useContext(ThemeContext);

	const computedStyles = useMemo(() => {
		const styles: StylesConfig = {
			container: (provided, state) => ({
				...provided,
				opacity: state.isDisabled ? 0.4 : 1,
				backgroundColor: colors.accentL1,
			}),
			singleValue: (provided) => ({
				...provided,
				color: colors.fontPrimary,
				boxShadow: 'none',
				fontSize: '14px',
				border: 'none',
			}),
			control: (provided) => ({
				...provided,
				color: colors.fontPrimary,
				cursor: 'pointer',
				boxShadow: 'none',
				border: `1px solid ${colors.accentL2}`,
				borderRadius: '1px',
				outline: 'none',
				height: '42px',
				'&:hover': {
					border: `1px solid ${colors.accentL2}`,
				},
			}),
			menu: (provided) => ({
				...provided,
				backgroundColor: colors.accentL1,
				border: `1px solid ${colors.accentL2}`,
				borderRadius: '1px',
			}),
			menuList: (provided) => ({
				...provided,
				borderRadius: '3px',
				paddingBottom: 0,
				paddingTop: 0,
				textAlign: 'left',
			}),
			option: (provided) => ({
				...provided,
				color: colors.fontPrimary,
				cursor: 'pointer',
				fontSize: '14px',
				backgroundColor: colors.accentL1,
				'&:hover': {
					backgroundColor: colors.accentL2,
				},
			}),
		};
		return styles;
	}, [colors]);

	return <ReactSelect styles={computedStyles} components={{ IndicatorSeparator }} {...props} />;
}

export default Select;
