import { Person } from "./Person";
import { Printer } from "./Printer";


let persons = new Array<Person>();

persons.push(new Person('John', 30));
persons.push(new Person('Adam', 23));
persons.push(new Person('Kate', 41));

Printer.printPersons(persons);