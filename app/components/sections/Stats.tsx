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
    <section className="relative w-full overflow-hidden border-0 bg-[#B6CBA9]">

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

{/* PREMIUM 3D STAT CARDS */}
<div className="absolute inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-[1050px] items-end justify-center gap-3 px-5 pb-8 sm:gap-6 sm:px-8 sm:pb-10 lg:gap-10 lg:pb-14">

  {/* LEFT CARD */}
  <div className="group mb-8 flex min-h-[210px] min-w-0 flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-white bg-gradient-to-br from-white via-[#F5F8F1] to-[#E5EDDF] p-4 shadow-[0_8px_0_#D2DECC,0_16px_30px_rgba(41,56,47,0.12)] transition-all duration-300 hover:-translate-y-2 sm:mb-10 sm:min-h-[260px] sm:p-6 lg:mb-14 lg:min-h-[280px] lg:p-7">

    <div className="pointer-events-none absolute" />

    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#71816E] sm:text-xs">
      Projects Delivered
    </p>

    <div>
      <h3 className="text-3xl font-extrabold tracking-[-0.07em] text-[#29382F] sm:text-5xl">
        150+
      </h3>
      <p className="mt-3 max-w-[180px] text-[10px] leading-relaxed text-[#657365] sm:text-sm">
        Successful projects completed
      </p>
    </div>

    <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#899783] sm:text-[10px]">
      Our Experience
    </span>
  </div>


  {/* CENTER FEATURED CARD */}
  <div className="relative mb-0 flex min-h-[260px] min-w-0 flex-[1.15] flex-col justify-between overflow-hidden rounded-2xl border border-[#718775] bg-gradient-to-br from-[#405C48] via-[#29382F] to-[#17291F] p-4 text-white shadow-[0_10px_0_#17291F,0_22px_45px_rgba(25,43,31,0.28)] transition-all duration-300 hover:-translate-y-2 sm:min-h-[330px] sm:p-7 lg:min-h-[360px] lg:p-8">

    {/* INTERNAL WAVE GRADIENT */}
    <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#B6CBA9]/25 blur-3xl sm:h-64 sm:w-64" />

    <div className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-[#8DAE8C]/30 blur-3xl sm:h-60 sm:w-60" />

    <div className="relative z-10">
      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#C5D8BB] sm:text-xs">
        Business Growth
      </p>
    </div>

    <div className="relative z-10">
      <h3 className="text-4xl font-extrabold tracking-[-0.07em] text-white sm:text-6xl">
        3X
      </h3>
      <p className="mt-3 max-w-[200px] text-[10px] leading-relaxed text-[#D2DDCF] sm:text-sm">
        Driving measurable business growth through digital strategies
      </p>
    </div>

    <span className="relative z-10 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#B6CBA9] sm:text-[10px]">
      Growth / 02
    </span>
  </div>


  {/* RIGHT CARD */}
  <div className="mb-8 flex min-h-[210px] min-w-0 flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-white bg-gradient-to-br from-white via-[#F5F8F1] to-[#E5EDDF] p-4 shadow-[0_8px_0_#D2DECC,0_16px_30px_rgba(41,56,47,0.12)] transition-all duration-300 hover:-translate-y-2 sm:mb-10 sm:min-h-[260px] sm:p-6 lg:mb-14 lg:min-h-[280px] lg:p-7">

    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#71816E] sm:text-xs">
      Client Satisfaction
    </p>

    <div>
      <h3 className="text-3xl font-extrabold tracking-[-0.07em] text-[#29382F] sm:text-5xl">
        98%
      </h3>
      <p className="mt-3 max-w-[180px] text-[10px] leading-relaxed text-[#657365] sm:text-sm">
        Focused on measurable results
      </p>
    </div>

    <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#899783] sm:text-[10px]">
      Client Trust
    </span>
  </div>

</div>


      

      {/* ORGANIC WAVE VECTOR */}
     <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[68%] overflow-hidden">

  <svg
    viewBox="0 0 1440 520"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
  >
    <defs>
      {/* Soft blurred edge */}
      <filter id="waveBlur" x="-10%" y="-30%" width="120%" height="160%">
        <feGaussianBlur stdDeviation="9" />
      </filter>

    </defs>

    {/* BACK WAVE - subtle and elevated */}
    <path
     d="
  M0 155
  C90 65 160 195 250 125
  C350 95 420 220 520 165
  C620 100 710 245 810 170
  C910 95 1010 225 1110 160
  C1210 45 1330 85 1440 105
  L1440 520 L0 520 Z
"
      fill="#FFFFFF"
      opacity="0.22"
    />

    {/* SECOND WAVE - more movement */}
    <path
     d="
  M0 205
  C100 105 170 240 270 190
  C370 130 450 275 550 205
  C650 135 740 285 840 210
  C940 130 1030 270 1130 205
  C1230 85 1350 115 1440 145
  L1440 520 L0 520 Z
"
      fill="#FFFFFF"
      opacity="0.45"
    />

    {/* SOFT FEATHERED EDGE */}
    <path
      d="
        M0 300
        C100 190 170 330 270 245
        C370 165 450 310 550 240
        C650 165 740 320 840 245
        C940 165 1030 305 1130 240
        C1230 175 1350 315 1440 230
      "
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="25"
      opacity="0.45"
      filter="url(#waveBlur)"
    />

    {/* MAIN WHITE WAVE */}
    <path
    d="
  M0 235
  C100 125 170 265 270 245
  C370 165 450 310 550 240
  C650 165 740 320 840 245
  C940 165 1030 305 1130 240
  C1230 115 1350 145 1440 165
  L1440 520
  L0 520 Z
"
      fill="#FFFFFF"
    />

  </svg>
</div>

    </section>
  );
}