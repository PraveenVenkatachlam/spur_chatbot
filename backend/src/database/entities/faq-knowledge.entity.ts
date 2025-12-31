import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('faq_knowledge')
export class FaqKnowledge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category: string;

  @Column('text')
  question: string;

  @Column('text')
  answer: string;

  @Column({ default: 0 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;
}