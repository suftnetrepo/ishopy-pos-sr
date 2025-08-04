import React, {useState} from 'react';
import {StyledText, StyledSpacer} from 'fluent-styles';
import {Stack} from '../../package/stack';
import {theme} from '../../../utils/theme';
import {StyledButton} from '../../package/button';
import {BarChart} from 'react-native-chart-kit';
import {fontStyles} from '../../../configs/theme';
import {formatCurrency} from '../../../utils/help';
import {
  useWeeklyTransactions,
  useTransactionTrend,
} from '../../../hooks/useDashboard';
import {StyledIcon} from '../../package/icon';

const DailyTransactionChart = () => {
  const [containerWidth, setContainerWidth] = useState(0);
  const {data} = useWeeklyTransactions();
  const {trend, dailyTransaction} = useTransactionTrend();

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 8,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
    },
  };

  return (
    <Stack
      vertical
       shadowOpacity={0.9}
      shadowColor={theme.colors.gray[200]}
      shadowRadius={8}
      onLayout={event => {
        const {width} = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
      marginVertical={16}
      marginLeft={16}
      justifyContent="flex-start"
      alignItems="flex-start"
      backgroundColor={theme.colors.gray[1]}
      borderRadius={8}
      paddingHorizontal={8}
      paddingVertical={16}>
      <StyledSpacer marginBottom={8} />
      <StyledText
        fontFamily={fontStyles.Roboto_Regular}
        fontSize={theme.fontSize.large}
        fontWeight={theme.fontWeight.normal}
        paddingHorizontal={8}
        color={theme.colors.gray[800]}>
        Daily transaction
      </StyledText>
      <StyledSpacer marginVertical={8} />
      <Stack horizonal justifyContent="flex-start" alignItems="center">
        <StyledText
          fontFamily={fontStyles.Roboto_Regular}
          fontSize={theme.fontSize.xxxlarge}
          fontWeight={theme.fontWeight.bold}
          paddingHorizontal={8}
          color={theme.colors.gray[800]}>
          {formatCurrency('£', dailyTransaction)}
        </StyledText>
        <Stack
          flexShrink={1}
          borderRadius={16}
          paddingHorizontal={20}
          paddingVertical={5}
          backgroundColor={
            trend === 'up' ? theme.colors.green[500] : theme.colors.red[400]
          }
          borderColor={
            trend === 'up' ? theme.colors.green[500] : theme.colors.red[400]
          }>
          <Stack
            horizonal
            justifyContent="center"
            paddingVertical={1}
            alignItems="center">
            <StyledIcon
              size={16}
              name={trend === 'up' ? 'arrow-upward' : 'arrow-downward'}
              color={theme.colors.gray[1]}
            />
          </Stack>
        </Stack>
      </Stack>
      <StyledSpacer marginVertical={8} />
      <BarChart
        data={data}
        width={containerWidth - 32}
        height={250}
        fromZero
        chartConfig={chartConfig}
        style={{
          marginVertical: 8,
          borderRadius: 16,
          marginLeft: 10,
        }}
      />
    </Stack>
  );
};

export default DailyTransactionChart;
