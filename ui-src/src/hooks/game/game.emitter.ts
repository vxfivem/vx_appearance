import { EventEmitter2 } from 'eventemitter2';

type Fn<T> = (arg: T) => unknown;

class GameEmitter {
  private eventEmitter: EventEmitter2;

  constructor() {
    this.eventEmitter = new EventEmitter2();
    window.addEventListener('message', (event) => {
      const { eventName, payload } = event.data;
      if (!eventName) {
        return;
      }
      this.eventEmitter.emit(eventName, payload);
    });
  }

  public on<T>(event: string, handler: Fn<T>): void {
    this.eventEmitter.on(event, handler);
  }

  public once<T>(event: string, handler: Fn<T>): void {
    this.eventEmitter.once(event, handler);
  }

  public off<T>(event: string, handler: Fn<T>): void {
    this.eventEmitter.on(event, handler);
  }

  public emit<T>(event: string, payload: T = null!): void {
    fetch(`https://${GetParentResourceName()}/${event}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(payload),
    })
      .then((r) => r)
      .catch(console.error);
  }
  public emitAsync<TPayload, TResult>(event: string, payload: TPayload = null!): Promise<TResult> {
    return fetch(`https://${GetParentResourceName()}/${event}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(payload),
    }).then((r) => r.json());
  }
}

export const gameEmitter = new GameEmitter();
