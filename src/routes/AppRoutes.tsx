import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

import HomePage from "../pages/HomePage";
import CreateWishPage from "../pages/CreateWishPage";
import PreviewPage from "../pages/PreviewPage";
import DownloadPage from "../pages/DownloadPage";
import HistoryPage from "../pages/HistoryPage";
import ResultPage from "../pages/ResultPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/create" element={<CreateWishPage />} />

        <Route path="/preview" element={<PreviewPage />} />

        <Route path="/download" element={<DownloadPage />} />

        <Route path="/history" element={<HistoryPage />} />

        <Route path="/result" element={<ResultPage/>}/>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
