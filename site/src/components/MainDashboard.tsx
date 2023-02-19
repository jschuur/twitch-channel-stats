import { Block, ColGrid } from '@tremor/react';

import RecentMessagesChart from '~/components/RecentMessagesChart';
import ScoreCard from '~/components/ScoreCard';

const MainDashboard = (): JSX.Element => (
  <>
    <ColGrid numColsMd={2} numColsLg={3} gapX='gap-x-6' gapY='gap-y-6' marginTop='mt-6'>
      <ScoreCard text='Tracked Channels' metric={37} />
      <ScoreCard text='Recent Messages' metric={123} />
      <ScoreCard text='Total Messages' metric={1234} />
    </ColGrid>

    <Block marginTop='mt-6'>
      <RecentMessagesChart />
    </Block>
  </>
);

export default MainDashboard;
