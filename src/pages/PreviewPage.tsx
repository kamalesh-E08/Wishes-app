import PreviewCanvas from "../components/preview/PreviewCanvas";
import PreviewSidebar from "../components/preview/PreviewSidebar";
import PreviewHeader from "../components/preview/PreviewHeader";

export default function PreviewPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <PreviewHeader />

      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
        <PreviewCanvas />
        <PreviewSidebar />
      </div>
    </div>
  );
}
