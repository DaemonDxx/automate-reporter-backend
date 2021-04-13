import { Departments } from '../../departments';
import { Electricity, SomeValue } from '../values';

export enum TypesIncidents {
  CONSOLIDATION = 'CONSOLIDATION',
  LEAVE = 'LEAVE',
  OTHER = 'OTHER',
}

export enum Importance {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export type SomeIncident = {
  department: Departments;
  year: number;
  type: TypesIncidents;
  description: string;
  isOnce: boolean;
  Reception: SomeValue;
  Recoil: SomeValue;
  importance: Importance;
};
