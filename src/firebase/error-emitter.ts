import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

// It's crucial to use a single, shared instance of the EventEmitter.
// We declare it here and export it.

type Events = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// We need to properly type our event emitter.
// We can't use the generic EventEmitter since that will lose the type information.
// We have to declare a class that extends EventEmitter and then type it.
class TypedEventEmitter extends EventEmitter {
  emit<E extends keyof Events>(event: E, ...args: Parameters<Events[E]>) {
    return super.emit(event, ...args);
  }

  on<E extends keyof Events>(event: E, listener: Events[E]) {
    return super.on(event, listener);
  }

  off<E extends keyof Events>(event: E, listener: Events[E]) {
    return super.off(event, listener);
  }

  once<E extends keyof Events>(event: E, listener: Events[E]) {
    return super.once(event, listener);
  }
}

export const errorEmitter = new TypedEventEmitter();
