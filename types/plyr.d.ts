declare module "plyr" {
  export interface PlyrOptions {
    controls?: string[];
    autoplay?: boolean;
    muted?: boolean;
    clickToPlay?: boolean;
    [key: string]: unknown;
  }

  export default class Plyr {
    constructor(target: HTMLElement | string, options?: PlyrOptions);
    play(): Promise<void> | void;
    pause(): void;
    destroy(): void;
    on(event: string, callback: (...args: unknown[]) => void): void;
  }
}
