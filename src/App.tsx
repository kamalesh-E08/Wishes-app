import AppRoutes from "./routes/AppRoutes";
import { useTheme } from "./hooks/useTheme";

function App() {
  useTheme(); // Initialize theme on mount
  return <AppRoutes />;
}

export default App;
