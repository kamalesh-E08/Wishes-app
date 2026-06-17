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
        "
      >
        <div
          className="
          absolute
          top-20
          left-20
          w-72
          h-72
          bg-purple-500/20
          blur-[120px]
          rounded-full
          "
        />

        <div
          className="
          absolute
          right-20
          bottom-20
          w-72
          h-72
          bg-cyan-500/20
          blur-[120px]
          rounded-full
          "
        />
      </div>
    </>
  );
};

export default GlowBackground;
