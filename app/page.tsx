'use client';
import { useStore } from '@/lib/store';
import Nav from '@/components/Nav';
import Landing from '@/components/Landing';
import IRQStage from '@/components/IRQ';
import TierResult from '@/components/TierResult';
import DDQ from '@/components/DDQ';
import OSINTVetting from '@/components/OSINTVetting';
import Report from '@/components/Report';

export default function Home() {
  const stage = useStore((s) => s.stage);

  return (
    <>
      <Nav />
      {stage === 'landing' && <Landing />}
      {stage === 'irq'     && <IRQStage />}
      {stage === 'tier'    && <TierResult />}
      {stage === 'ddq'     && <DDQ />}
      {stage === 'osint'   && <OSINTVetting />}
      {stage === 'report'  && <Report />}
    </>
  );
}
