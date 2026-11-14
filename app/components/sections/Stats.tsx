const waveHeights = [
  180, 145, 205, 165, 225, 155, 190, 135, 215, 175,
  145, 205, 160, 225, 180, 125, 195, 150, 215, 170,
  130, 200, 155, 225, 175, 140, 210, 160, 195, 125,
  180, 220, 150, 205, 165, 130, 215, 175, 145, 200,
  155, 225, 180, 135, 205, 160, 220, 150, 190, 130,
  210, 170, 145, 220, 165, 195, 135, 205, 155, 185,
];

const wavePath = (() => {
  const width = 1440;
  const step = width / (waveHeights.length - 1);

  const points = waveHeights.map((height, index) => {
    return `${(index * step).toFixed(1)},${height}`;
  });

  return `
    M 0 ${waveHeights[0]}
    L ${points.slice(1).join(" L ")}
    L 1440 310
    L 1440 420
    L 0 420
    Z
  `;
})();

export default function GrowthNumbers() {
  return (
    <section className="relative w-full overflow-hidden bg-[#B6CBA9]">

      {/* HEADING */}
      <div className="relative z-10 flex min-h-[720px] flex-col items-center px-5 pt-14 text-center sm:min-h-[770px] sm:pt-20 lg:min-h-[850px] lg:pt-24">

        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#29382F]">
          By The Numbers
        </p>

        <h2 className="mt-6 max-w-[520px] text-[clamp(2.5rem,10vw,3.5rem)] font-bold uppercase leading-[0.98] tracking-[-0.065em] text-[#29382F] sm:text-6xl lg:text-7xl">
          Growth that,
          <br />
          speaks for
          <br />
          <span className="mt-2 inline-block rounded-full bg-[#29382F] px-4 py-2.5 text-white sm:mt-3 sm:px-7 sm:py-3">
            itself.
          </span>
        </h2>

      </div>

      {/* STAT CARDS ROW: one flex row, aligned to the bottom.
          Side cards sit a little higher, center card sits lower. */}
    
{/* STAT CARDS ROW */}
<div className="absolute inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-[1050px] items-end justify-center gap-3 px-5 pb-8 sm:gap-6 sm:px-8 sm:pb-10 lg:gap-10 lg:pb-14">

  {/* LEFT STAT CARD */}
  <div className="relative mb-8 flex min-h-[210px] min-w-0 flex-1 flex-col justify-between overflow-hidden border border-[#DCE5D7] bg-[#F8FAF5] p-4 sm:mb-10 sm:min-h-[260px] sm:p-6 lg:mb-14 lg:min-h-[280px] lg:p-7">

    {/* Angular vector detail */}
    <svg className="pointer-events-none absolute right-0 top-0 h-24 w-24 text-[#B6CBA9] sm:h-32 sm:w-32" viewBox="0 0 120 120" fill="none">
      <path d="M120 0H65L120 55V0Z" fill="currentColor" opacity=".25" />
      <path d="M78 0L120 42M94 0L120 26M110 0L120 10" stroke="currentColor" strokeWidth="1.2" />
      <path d="M65 0L120 55" stroke="#657365" strokeWidth="1" opacity=".5" />
    </svg>

    <p className="relative z-10 text-[9px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-[#657365] sm:text-xs sm:tracking-[0.14em]">
      Projects Delivered
    </p>

    <div className="relative z-10">
      <h3 className="text-3xl font-bold tracking-[-0.06em] text-[#29382F] sm:text-5xl">
        150+
      </h3>
      <p className="mt-3 max-w-[180px] text-[10px] leading-relaxed text-[#657365] sm:text-sm">
        Successful projects completed
      </p>
    </div>

    <div className="relative z-10 flex items-center gap-2">
      <div className="h-[3px] w-10 bg-[#506B59]" />
      <div className="h-[3px] w-3 bg-[#B6CBA9]" />
    </div>
  </div>


  {/* CENTER STAT CARD */}
  <div className="relative flex min-h-[260px] min-w-0 flex-[1.15] flex-col justify-between overflow-hidden bg-[#29382F] p-4 text-white shadow-[0_18px_45px_rgba(41,56,47,0.16)] sm:min-h-[330px] sm:p-7 lg:min-h-[360px] lg:p-8">

    {/* Geometric vector pattern */}
    <svg className="pointer-events-none absolute right-0 top-0 h-36 w-36 text-[#B6CBA9] sm:h-48 sm:w-48" viewBox="0 0 180 180" fill="none">
      <path d="M180 0H80L180 100V0Z" fill="currentColor" opacity=".12" />
      <path d="M95 0L180 85M115 0L180 65M135 0L180 45M155 0L180 25" stroke="currentColor" strokeWidth="1" opacity=".65" />
      <path d="M80 0L180 100" stroke="currentColor" strokeWidth="1.2" opacity=".8" />
      <path d="M180 100V180H100L180 100Z" fill="currentColor" opacity=".07" />
    </svg>

    <p className="relative z-10 text-[9px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-[#C5D2BD] sm:text-xs sm:tracking-[0.14em]">
      Business Growth
    </p>

    <div className="relative z-10">
      <h3 className="text-4xl font-bold tracking-[-0.06em] text-white sm:text-6xl">
        3X
      </h3>
      <p className="mt-3 max-w-[200px] text-[10px] leading-relaxed text-[#D1D9CE] sm:text-sm">
        Driving measurable business growth through digital strategies
      </p>
    </div>

    <div className="relative z-10 flex items-center justify-between">
      <div className="h-[3px] w-12 bg-[#B6CBA9]" />
      <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#C5D2BD]">
        Growth / 02
      </span>
    </div>
  </div>


  {/* RIGHT STAT CARD */}
  <div className="relative mb-8 flex min-h-[210px] min-w-0 flex-1 flex-col justify-between overflow-hidden border border-[#DCE5D7] bg-[#F8FAF5] p-4 sm:mb-10 sm:min-h-[260px] sm:p-6 lg:mb-14 lg:min-h-[280px] lg:p-7">

    {/* Diagonal vector detail */}
    <svg className="pointer-events-none absolute right-0 top-0 h-24 w-24 text-[#B6CBA9] sm:h-32 sm:w-32" viewBox="0 0 120 120" fill="none">
      <path d="M120 0V65L55 0H120Z" fill="currentColor" opacity=".25" />
      <path d="M120 78L42 0M120 94L26 0M120 110L10 0" stroke="currentColor" strokeWidth="1.2" />
      <path d="M55 0L120 65" stroke="#657365" strokeWidth="1" opacity=".5" />
    </svg>

    <p className="relative z-10 text-[9px] font-semibold uppercase leading-relaxed tracking-[0.12em] text-[#657365] sm:text-xs sm:tracking-[0.14em]">
      Client Satisfaction
    </p>

    <div className="relative z-10">
      <h3 className="text-3xl font-bold tracking-[-0.06em] text-[#29382F] sm:text-5xl">
        98%
      </h3>
      <p className="mt-3 max-w-[180px] text-[10px] leading-relaxed text-[#657365] sm:text-sm">
        Focused on measurable results
      </p>
    </div>

    <div className="relative z-10 flex items-center gap-2">
      <div className="h-[3px] w-10 bg-[#506B59]" />
      <div className="h-[3px] w-3 bg-[#B6CBA9]" />
    </div>
  </div>

</div>

      

      {/* ORGANIC WAVE VECTOR */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[58%]">
        <svg
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <defs>
            {/* Fade only around the upper wave edge */}
            <linearGradient
              id="waveEdgeFade"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="white" stopOpacity="0.15" />
              <stop offset="20%" stopColor="white" stopOpacity="0.5" />
              <stop offset="45%" stopColor="white" stopOpacity="1" />
            </linearGradient>

            <mask id="waveEdgeMask">
              <rect width="1440" height="420" fill="url(#waveEdgeFade)" />
            </mask>
          </defs>

          {/* FULL SOLID WHITE VECTOR */}
          <path d={wavePath} fill="#FFFFFF" />

          {/* SOFT EDGE EFFECT */}
          <path d={wavePath} fill="url(#waveEdgeFade)" opacity="0.35" />
        </svg>

        
      </div>

    </section>
  );
}