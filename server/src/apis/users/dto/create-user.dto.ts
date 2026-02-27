export class CreateUserDto {
	name: string;
	email: string;
	password: string;
	location?: string;
	tempUnit?: 'F' | 'C';
	windUnit?: 'mph' | 'kmh';
}
