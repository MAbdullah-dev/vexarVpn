import {
  DEMO_SPEED_DOWNLOAD_MBPS,
  DEMO_SPEED_PING_MS,
  DEMO_SPEED_UPLOAD_MBPS,
} from '../../constants/speed';

export type SpeedPhase =
  | 'idle'
  | 'preparing'
  | 'download'
  | 'upload'
  | 'completing'
  | 'completed'
  | 'failed';

export type DemoSpeedRun = {
  phase: SpeedPhase;
  progress: number;
  gaugeMbps: number | null;
  sampleDownloadMbps: number | null;
  sampleUploadMbps: number | null;
  samplePingMs: number | null;
  errorMessage: string | null;
  simulated: true;
};

export type DemoSpeedRecord = {
  id: string;
  completedAt: number;
  sampleDownloadMbps: number;
  sampleUploadMbps: number;
  samplePingMs: number;
};

export type DemoSpeedSnapshot = {
  run: DemoSpeedRun;
  history: readonly DemoSpeedRecord[];
};

const runningPhases: readonly SpeedPhase[] = [
  'preparing',
  'download',
  'upload',
  'completing',
];

function idleRun(): DemoSpeedRun {
  return {
    phase: 'idle',
    progress: 0,
    gaugeMbps: null,
    sampleDownloadMbps: null,
    sampleUploadMbps: null,
    samplePingMs: null,
    errorMessage: null,
    simulated: true,
  };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export class DemoSpeedTest {
  private run: DemoSpeedRun = idleRun();
  private history: DemoSpeedRecord[] = [];
  private listeners = new Set<(snapshot: DemoSpeedSnapshot) => void>();
  private generation = 0;
  private recordCount = 0;

  constructor(private readonly phaseMs = 350) {}

  getSnapshot(): DemoSpeedSnapshot {
    return { run: this.run, history: this.history };
  }

  subscribe(listener: (snapshot: DemoSpeedSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  reset(): void {
    this.generation += 1;
    this.run = idleRun();
    this.history = [];
    this.publish();
  }

  isRunning(): boolean {
    return runningPhases.includes(this.run.phase);
  }

  async start(): Promise<void> {
    if (this.isRunning()) {
      return;
    }
    const generation = ++this.generation;
    this.patch({
      phase: 'preparing',
      progress: 0,
      gaugeMbps: null,
      sampleDownloadMbps: null,
      sampleUploadMbps: null,
      samplePingMs: null,
      errorMessage: null,
    });
    if (!(await this.step(generation))) {
      return;
    }

    for (const step of [1, 2, 3]) {
      this.patch({
        phase: 'download',
        progress: step / 3,
        gaugeMbps: round1(DEMO_SPEED_DOWNLOAD_MBPS * (step / 3)),
      });
      if (!(await this.step(generation))) {
        return;
      }
    }
    this.patch({ sampleDownloadMbps: DEMO_SPEED_DOWNLOAD_MBPS });

    for (const step of [1, 2, 3]) {
      this.patch({
        phase: 'upload',
        progress: step / 3,
        gaugeMbps: round1(DEMO_SPEED_UPLOAD_MBPS * (step / 3)),
      });
      if (!(await this.step(generation))) {
        return;
      }
    }
    this.patch({
      sampleUploadMbps: DEMO_SPEED_UPLOAD_MBPS,
      samplePingMs: DEMO_SPEED_PING_MS,
    });

    this.patch({
      phase: 'completing',
      progress: 1,
      gaugeMbps: DEMO_SPEED_DOWNLOAD_MBPS,
    });
    if (!(await this.step(generation))) {
      return;
    }

    this.recordCount += 1;
    const record: DemoSpeedRecord = {
      id: `demo-${this.recordCount}`,
      completedAt: Date.now(),
      sampleDownloadMbps: DEMO_SPEED_DOWNLOAD_MBPS,
      sampleUploadMbps: DEMO_SPEED_UPLOAD_MBPS,
      samplePingMs: DEMO_SPEED_PING_MS,
    };
    this.history = [record, ...this.history].slice(0, 8);
    this.patch({
      phase: 'completed',
      progress: 1,
      gaugeMbps: DEMO_SPEED_DOWNLOAD_MBPS,
      sampleDownloadMbps: DEMO_SPEED_DOWNLOAD_MBPS,
      sampleUploadMbps: DEMO_SPEED_UPLOAD_MBPS,
      samplePingMs: DEMO_SPEED_PING_MS,
      errorMessage: null,
    });
  }

  fail(message: string): void {
    this.generation += 1;
    this.patch({
      phase: 'failed',
      errorMessage: message,
      progress: this.run.progress,
    });
  }

  stop(): void {
    const running = this.isRunning();
    this.generation += 1;
    if (running) {
      this.run = idleRun();
      this.publish();
    }
  }

  private async step(generation: number): Promise<boolean> {
    await new Promise<void>(resolve => {
      setTimeout(resolve, this.phaseMs);
    });
    return generation === this.generation;
  }

  private patch(patch: Partial<DemoSpeedRun>): void {
    this.run = { ...this.run, ...patch, simulated: true };
    this.publish();
  }

  private publish(): void {
    const snapshot = this.getSnapshot();
    this.listeners.forEach(listener => listener(snapshot));
  }
}

export const demoSpeedTest = new DemoSpeedTest();
