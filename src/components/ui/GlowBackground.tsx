const GlowBackground = () => {
  return (
    <>
      <div
        className="
        fixed
        top-0
        left-0
        w-full
        h-full
        -z-10
        overflow-hidden
        bg-[#FAF9F6]
        dark:bg-slate-950
        transition-colors
        "
      >
        <div
          className="
          absolute
          top-20
          left-20
          w-[500px]
          h-[500px]
          bg-teal-500/5
          blur-[130px]
          rounded-full
          "
        />

        <div
          className="
          absolute
          right-20
          bottom-20
          w-[500px]
          h-[500px]
          bg-emerald-500/5
          blur-[130px]
          rounded-full
          "
        />
      </div>
    </>
  );
};

export default GlowBackground;
