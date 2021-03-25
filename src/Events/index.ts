import { Event$Base } from '../Typings/Modules/Events';

export abstract class BaseEvent implements Event$Base {
  static Name = 'BaseEvent';
}
