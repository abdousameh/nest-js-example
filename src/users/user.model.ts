import { prop, mongoose } from '@typegoose/typegoose';
import { IsString, IsDate } from 'class-validator';

export enum UserStatus {
  CREATED,
  VALIDATED,
  BLOCKED,
}

export class User {
  @IsString()
  @prop({ refType: mongoose.Schema.Types.ObjectId })
  id: string;

  @IsString()
  @prop({ minlength: 2, maxlength: 30, trim: true, default: '' })
  lastname: string;

  @IsString()
  @prop({ minlength: 2, maxlength: 30, trim: true, default: '' })
  firstname: string;

  @IsString()
  @prop({
    unique: true,
    minlength: 8,
    maxlength: 30,
    lowercase: true,
    trim: true,
  })
  username: string;

  @IsString()
  @prop({
    required: true,
    unique: true,
    minlength: 8,
    maxlength: 30,
    lowercase: true,
    trim: true,
  })
  email: string;

  @IsString()
  @prop({
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 12,
    trim: true,
  })
  pseudo: string;

  @IsString()
  @prop({ required: true, maxlength: 255, trim: true })
  password: string;

  @IsString()
  @prop({ maxlength: 100, default: '' })
  avatarPath: string;

  @IsString()
  @prop({ enum: UserStatus, default: UserStatus.CREATED })
  status: number;

  @IsDate()
  @prop({ default: new Date() })
  readonly creationDate: Date;

  @IsDate()
  @prop({ default: new Date() })
  modificationDate: Date;
}
