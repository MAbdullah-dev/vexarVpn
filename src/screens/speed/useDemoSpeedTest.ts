import { useEffect, useState } from 'react';

import {
  demoSpeedTest,
  type DemoSpeedSnapshot,
} from '../../services/speed/DemoSpeedTest';

export function useDemoSpeedTest() {
  const [snapshot, setSnapshot] = useState<DemoSpeedSnapshot>(
    demoSpeedTest.getSnapshot(),
  );

  useEffect(() => {
    const unsubscribe = demoSpeedTest.subscribe(setSnapshot);
    return () => {
      unsubscribe();
      demoSpeedTest.stop();
    };
  }, []);

  return {
    run: snapshot.run,
    history: snapshot.history,
    start: () => demoSpeedTest.start(),
  };
}
