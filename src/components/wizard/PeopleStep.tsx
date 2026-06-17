import { useWishStore } from "../../store/wishesStore";

const options = ["Family", "Friends", "Colleagues"];

export default function PeopleStep() {
  const { people, setPeople } = useWishStore();

  const togglePerson = (person: string) => {
    if (people.includes(person)) {
      setPeople(people.filter((p) => p !== person));
    } else {
      setPeople([...people, person]);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {options.map((person) => (
        <button
          key={person}
          onClick={() => togglePerson(person)}
          className={`
            p-8
            rounded-3xl
            border
            transition
            ${
              people.includes(person)
                ? "border-purple-500 bg-purple-500/20"
                : "border-white/10 bg-white/5"
            }
          `}
        >
          {person}
        </button>
      ))}
    </div>
  );
}
