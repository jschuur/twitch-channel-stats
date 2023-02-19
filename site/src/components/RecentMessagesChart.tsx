import { BarChart, Card, Title } from '@tremor/react';

const data = [
  {
    Month: 'Jan 21',
    Matty_TwoShoes: 2890,
    techygrrrl: 1400,
    geometricjim: 4938,
  },
  {
    Month: 'Feb 21',
    Matty_TwoShoes: 1890,
    techygrrrl: 998,
    geometricjim: 2938,
  },
  // ...
  {
    Month: 'Jan 22',
    Matty_TwoShoes: 3890,
    techygrrrl: 2980,
    geometricjim: 2645,
  },
];

const valueFormatter = (number: number) => Intl.NumberFormat('us').format(number).toString();

export default function RecentMessagesChart() {
  return (
    <Card>
      <Title>Recent Chat Messages</Title>
      <BarChart
        marginTop='mt-4'
        data={data}
        dataKey='Month'
        categories={['Matty_TwoShoes', 'techygrrrl', 'geometricjim']}
        colors={['sky', 'violet', 'fuchsia']}
        valueFormatter={valueFormatter}
        stack={true}
        height='h-80'
      />
    </Card>
  );
}
