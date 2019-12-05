import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { SessionEntity } from 'typeorm-store';

/**
 * Struktura danych będąca modelem sesji użytkwonika
 */
@Entity()
export default class Session extends BaseEntity implements SessionEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    expiresAt: number;

    @Column()
    data: string;
}