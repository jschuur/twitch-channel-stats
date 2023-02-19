import { Text, Title } from '@tremor/react';

import MainDashboard from '~/components/MainDashboard';

export default function HomePage() {
  return (
    <main className='p-6 sm:p-10'>
      <Title>Oddly Specific Twitch Chat Stats</Title>
      <Text>
        An experimental dashboard featuring{' '}
        <a href='https://www.twitch.tv/directory/game/Software%20and%20Game%20Development'>
          Software and Development
        </a>{' '}
        streamers from <a href='https://theclaw.team'>The Claw</a> and beyond. Built with{' '}
        <a href='https://tinybird.co'>Tinybird</a>, <a href='https://www.tremor.so/'>Tremor</a> and{' '}
        <a href='https://twurple.js.org/'>Twurple</a> by{' '}
        <a href='https://twitter.com/joostschuur'>Joost Schuur</a>
      </Text>

      <MainDashboard />
    </main>
  );
}
