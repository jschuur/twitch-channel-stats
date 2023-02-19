import type { Color } from '@tremor/react';
import { Card, Metric, Text } from '@tremor/react';

interface ScoreCardProps {
  text: string;
  metric: number;
  decorationColor?: string;
}

const ScoreCard = ({ text, metric, decorationColor = 'blue' }: ScoreCardProps): JSX.Element => (
  <Card decorationColor={decorationColor as Color} decoration={'top'}>
    <Text>{text}</Text>
    <Metric>{metric}</Metric>
  </Card>
);

export default ScoreCard;
