import PreviewCanvas from "../components/preview/PreviewCanvas";
import PreviewSidebar from "../components/preview/PreviewSidebar";
import PreviewHeader from "../components/preview/PreviewHeader";

export default function PreviewPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <PreviewHeader />

      <div
        className="
        grid
        lg:grid-cols-[1.5fr_1fr]
        gap-10
        items-start
        "
      >
        <PreviewCanvas />
        <PreviewSidebar />
      </div>
    </div>
  );
}
