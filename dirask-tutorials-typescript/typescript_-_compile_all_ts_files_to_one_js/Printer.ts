import { Person } from "./Person";

export class Printer
{
	public static printPerson(person : Person) : void
	{
		console.log(person.toString());
	}
	
	public static printPersons(persons : Array<Person>) : void
	{
		for(let entry of persons)
			this.printPerson(entry);
	}
}