import { PrimaryGeneratedColumn } from 'typeorm';

export class AbastractEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
