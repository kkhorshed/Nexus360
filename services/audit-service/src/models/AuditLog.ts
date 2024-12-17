import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_logs')
@Index(['entityId', 'timestamp'])
@Index(['userId', 'timestamp'])
@Index(['entityType', 'timestamp'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Index()
  entityId!: string;

  @Column()
  @Index()
  entityType!: string;

  @Column({
    type: 'enum',
    enum: ['CREATE', 'UPDATE', 'DELETE']
  })
  action!: 'CREATE' | 'UPDATE' | 'DELETE';

  @Column('jsonb')
  changes!: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];

  @Column()
  @Index()
  userId!: string;

  @Column()
  userType!: string;

  @CreateDateColumn()
  @Index()
  timestamp!: Date;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  constructor(partial: Partial<AuditLog>) {
    Object.assign(this, partial);
  }
}
