export interface Service<T> {
  findAll(): Promise<T[]>;
  findOne(id: string): Promise<T>;
  create(dto: any): Promise<T>;
  update(id: string, dto: any): Promise<T>;
  delete(id: string): Promise<void>;
}
