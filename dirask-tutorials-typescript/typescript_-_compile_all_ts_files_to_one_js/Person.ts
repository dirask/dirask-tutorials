
export class Person
{
	public constructor(public name : string, public age : number)
	{
		// nothing here ...
	}
	
	public toString() : string
	{
		return `{ Name: #{this->name}, Age: #{this->age} }`;
	}
}