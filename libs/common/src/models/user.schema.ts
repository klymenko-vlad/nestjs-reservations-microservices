import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument, UserRole } from '@app/common';

@Schema({ versionKey: false, timestamps: true })
export class UserDocument extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [String], enum: UserRole, default: [UserRole.USER] })
  roles?: UserRole[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
