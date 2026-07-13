import { useEventStore } from "../../store/eventStore";

export default function ImportedEventsTable() {
  const { manualEvents, oneDriveEvents, activeSource, setActiveSource } =
    useEventStore();
  const events = activeSource === "manual" ? manualEvents : oneDriveEvents;

  return (
    <div
      className="
        bg-white/5
        rounded-2xl
        p-6
        mt-6
        border
        border-white/10
        backdrop-blur-md
      "
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">
          {activeSource === "manual"
            ? "Manual Uploaded Events"
            : "OneDrive Events"}
        </h2>

        <span
          className="
            px-3
            py-1
            rounded-full
            bg-purple-500/20
            text-purple-300
            text-sm
            w-fit
          "
        >
          {events.length} Records
        </span>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveSource("manual")}
          className={`
            px-4
            py-2
            rounded-xl
            transition-all
            ${
              activeSource === "manual"
                ? "bg-purple-600 text-white"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }
          `}
        >
          Manual Upload
        </button>

        <button
          onClick={() => setActiveSource("onedrive")}
          className={`
            px-4
            py-2
            rounded-xl
            transition-all
            ${
              activeSource === "onedrive"
                ? "bg-green-600 text-white"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }
          `}
        >
          OneDrive
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] md:min-w-[800px]">
          <thead>
            <tr
              className="
                border-b
                border-white/10
                text-left
                text-gray-400
              "
            >
              <th className="py-3">Name</th>
              <th>Email</th>
              <th>PhotoUrl</th>
              <th>Department</th>
              <th>Event Type</th>
              <th>Event Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr
                  key={event._id}
                  className="
                    border-b
                    border-white/5
                    hover:bg-white/5
                    transition
                  "
                >
                  <td className="py-4 font-medium">{event.Name}</td>

                  <td>{event.Email}</td>
                  <td>
                    {event.photoUrl ? (
                      <img
                        src={event.photoUrl}
                        alt={event.Name}
                        className="
                          w-12
                          h-12
                          rounded-full
                          object-cover
                          border
                          border-white/10
                        "
                      />
                    ) : (
                      <span className="text-gray-500">No Photo</span>
                    )}
                  </td>

                  <td>{event.Department || "-"}</td>

                  <td>{event.EventType}</td>

                  <td>{event.EventDate}</td>

                  <td>
                    <span
                      className={`
                          px-2
                          py-1
                          rounded-full
                          text-xs

                          ${
                            event.status === "sent"
                              ? "bg-green-500/20 text-green-300"
                              : event.status === "generated"
                                ? "bg-blue-500/20 text-blue-300"
                                : event.status === "failed"
                                  ? "bg-red-500/20 text-red-300"
                                  : "bg-yellow-500/20 text-yellow-300"
                          }
                        `}
                    >
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="
                    text-center
                    py-10
                    text-gray-400
                  "
                >
                  No events found in{" "}
                  <span className="font-medium">
                    {activeSource === "manual" ? "Manual Upload" : "OneDrive"}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
