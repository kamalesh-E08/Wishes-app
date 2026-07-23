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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {options.map((person) => (
        <button
          key={person}
          onClick={() => togglePerson(person)}
          className={`
            p-4 sm:p-8
            rounded-3xl
            border
            transition-all
            font-bold
            text-base
            cursor-pointer
            ${
              people.includes(person)
                ? "border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/50 text-teal-800"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-350 shadow-sm"
            }
          `}
        >
          {person}
        </button>
      ))}
    </div>
  );
}
