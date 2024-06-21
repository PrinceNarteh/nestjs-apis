import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTenantDto {
  @IsNotEmpty()
  @IsString()
  companyName: string;
}
