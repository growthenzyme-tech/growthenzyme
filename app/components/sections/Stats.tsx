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
    <section className="relative w-full overflow-hidden border-0 bg-transparent">
{/* TOP HALF GREEN BACKGROUND */}
{/* TOP GREEN BACKGROUND */}
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[65%] bg-[#B6CBA9]"
/>
      {/* HEADING */}
      <div className="relative z-10 flex min-h-[720px] flex-col items-center px-5 pt-14 text-center sm:min-h-[770px] sm:pt-20 lg:min-h-[850px] lg:pt-24">

       <p className="font-heading inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#2F4A39] sm:text-xs sm:tracking-[0.22em]">
  <span className="h-1.5 w-1.5 rounded-full bg-[#D78359]" />
  By The Numbers
</p>

        <h2 className="font-heading mt-6 w-full max-w-none whitespace-nowrap text-[clamp(1.65rem,5.2vw,4.5rem)] font-bold uppercase leading-[1.05] tracking-[-0.065em] text-[#29382F]">
          Growth that speaks for
          <br />
          <span className="inline-block rounded-full bg-[#29382F] px-5 py-2.5 text-white sm:px-7 sm:py-3">
            itself.
          </span>
        </h2>

      </div>

      {/* STAT CARDS ROW: one flex row, aligned to the bottom.
          Side cards sit a little higher, center card sits lower. */}
    
{/* STAT CARDS ROW */}

{/* PREMIUM 3D STAT CARDS */}
<div className="absolute inset-x-0 bottom-0 z-30 mx-auto grid w-full max-w-[1200px] grid-cols-2 items-end gap-3 px-5 pb-12 sm:gap-5 sm:px-8 sm:pb-16 lg:grid-cols-4 lg:gap-6 lg:px-8 lg:pb-30">

  {/* LEFT CARD */}
  <div className="group mb-8 flex min-h-[190px] min-w-0 flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-white bg-gradient-to-br from-white via-[#F5F8F1] to-[#E5EDDF] p-4 shadow-[0_8px_0_#D2DECC,0_16px_30px_rgba(41,56,47,0.12)] transition-all duration-300 hover:-translate-y-2 sm:mb-10 sm:min-h-[240px] sm:p-6 lg:mb-14 lg:min-h-[240px] lg:p-7">

    <div className="pointer-events-none absolute" />

    <p className="font-heading text-[9px] font-bold uppercase tracking-[0.16em] text-[#71816E] sm:text-xs">
      Projects Delivered
    </p>

    <div>
      <h3 className="font-heading text-3xl font-extrabold tracking-[-0.07em] text-[#29382F] sm:text-5xl">
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
  <div className="relative mb-0 flex min-h-[220px] min-w-0 flex-[1.15] flex-col justify-between overflow-hidden rounded-2xl border border-[#718775] bg-gradient-to-br from-[#405C48] via-[#29382F] to-[#17291F] p-4 text-white shadow-[0_10px_0_#17291F,0_22px_45px_rgba(25,43,31,0.28)] transition-all duration-300 hover:-translate-y-2 sm:min-h-[325px] sm:p-7 lg:min-h-[325px] lg:p-8">

    {/* INTERNAL WAVE GRADIENT */}
    <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#B6CBA9]/25 blur-3xl sm:h-64 sm:w-64" />

    <div className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-[#8DAE8C]/30 blur-3xl sm:h-60 sm:w-60" />

    <div className="relative z-10">
      <p className="font-heading text-[9px] font-bold uppercase tracking-[0.16em] text-[#C5D8BB] sm:text-xs">
        Business Growth
      </p>
    </div>

    <div className="relative z-10">
      <h3 className="font-heading text-4xl font-extrabold tracking-[-0.07em] text-white sm:text-6xl">
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
  <div className="mb-8 flex min-h-[190px] min-w-0 flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-white bg-gradient-to-br from-white via-[#F5F8F1] to-[#E5EDDF] p-4 shadow-[0_8px_0_#D2DECC,0_16px_30px_rgba(41,56,47,0.12)] transition-all duration-300 hover:-translate-y-2 sm:mb-10 sm:min-h-[240px] sm:p-6 lg:mb-14 lg:min-h-[240px] lg:p-7">

    <p className="font-heading text-[9px] font-bold uppercase tracking-[0.16em] text-[#71816E] sm:text-xs">
      Client Satisfaction
    </p>

    <div>
      <h3 className="font-heading text-3xl font-extrabold tracking-[-0.07em] text-[#29382F] sm:text-5xl">
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

  
{/* FOURTH FEATURED CARD */}
<div className="relative mb-8 flex min-h-[220px] min-w-0 flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-[#718775] bg-gradient-to-br from-[#405C48] via-[#29382F] to-[#17291F] p-4 text-white shadow-[0_10px_0_#17291F,0_22px_45px_rgba(25,43,31,0.28)] transition-all duration-300 hover:-translate-y-2 sm:mb-0 sm:min-h-[325px] sm:p-7 lg:mb-0 lg:min-h-[325px] lg:p-8">

  {/* Background glow */}
  <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#B6CBA9]/25 blur-3xl sm:h-64 sm:w-64" />

  <div className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-[#8DAE8C]/30 blur-3xl sm:h-60 sm:w-60" />

  <div className="relative z-10">
    <p className="font-heading text-[9px] font-bold uppercase tracking-[0.16em] text-[#C5D8BB] sm:text-xs">
      Industries Served
    </p>
  </div>

  <div className="relative z-10 mt-4">
    <h3 className="font-heading text-4xl font-extrabold tracking-[-0.07em] text-white sm:text-6xl">
      12
    </h3>
    <p className="mt-4 max-w-[180px] text-[10px] leading-relaxed text-[#D2DDCF] sm:text-sm">
      Supporting businesses across industries
    </p>
  </div>

  <span className="relative z-10 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#B6CBA9] sm:text-[10px]">
    Our Reach / 04
  </span>
</div>


</div>


      

      {/* ORGANIC WAVE VECTOR */}


    </section>
  );
}