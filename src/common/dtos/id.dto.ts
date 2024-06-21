import { IsMongoId, IsNotEmpty } from 'class-validator';

export class IdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
