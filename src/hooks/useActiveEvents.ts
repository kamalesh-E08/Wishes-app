import { useEventStore } from "../store/eventStore";

export const useActiveEvents = () => {
  const { manualEvents, oneDriveEvents, activeSource } = useEventStore();

  return activeSource === "manual" ? manualEvents : oneDriveEvents;
};
