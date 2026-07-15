export default function Cassette({ className = '' }) {
  return (
    <svg
      viewBox="0 0 320 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="사연과 노래를 주고받는 카세트테이프 일러스트"
    >
      <rect x="4" y="4" width="312" height="192" rx="16" fill="#241a22" stroke="#4a3a42" strokeWidth="2" />
      <rect x="24" y="24" width="272" height="92" rx="8" fill="#f3ead9" opacity="0.06" />
      <rect x="24" y="24" width="272" height="92" rx="8" fill="none" stroke="#5f8f82" strokeWidth="1.5" opacity="0.5" />

      {/* 좌우 릴 */}
      <g className="reel reel-left" style={{ transformBox: 'fill-box' }}>
        <circle cx="98" cy="70" r="34" fill="#171018" stroke="#5f8f82" strokeWidth="2" />
        <circle cx="98" cy="70" r="10" fill="#f3ead9" />
        <g stroke="#5f8f82" strokeWidth="2">
          <line x1="98" y1="46" x2="98" y2="94" />
          <line x1="74" y1="70" x2="122" y2="70" />
          <line x1="81" y1="53" x2="115" y2="87" />
          <line x1="115" y1="53" x2="81" y2="87" />
        </g>
      </g>

      <g className="reel reel-right" style={{ transformBox: 'fill-box' }}>
        <circle cx="222" cy="70" r="34" fill="#171018" stroke="#c96f2e" strokeWidth="2" />
        <circle cx="222" cy="70" r="10" fill="#f3ead9" />
        <g stroke="#c96f2e" strokeWidth="2">
          <line x1="222" y1="46" x2="222" y2="94" />
          <line x1="198" y1="70" x2="246" y2="70" />
          <line x1="205" y1="53" x2="239" y2="87" />
          <line x1="239" y1="53" x2="205" y2="87" />
        </g>
      </g>

      <rect x="140" y="60" width="40" height="20" rx="4" fill="#171018" />

      {/* 라벨 텍스트 영역 */}
      <rect x="24" y="128" width="272" height="44" rx="6" fill="none" stroke="#4a3a42" strokeWidth="1.5" />
      <line x1="40" y1="142" x2="180" y2="142" stroke="#f3ead9" strokeWidth="1.5" opacity="0.35" />
      <line x1="40" y1="154" x2="220" y2="154" stroke="#f3ead9" strokeWidth="1.5" opacity="0.2" />

      {/* 하단 스크류 */}
      <circle cx="20" cy="20" r="2.5" fill="#4a3a42" />
      <circle cx="300" cy="20" r="2.5" fill="#4a3a42" />
      <circle cx="20" cy="180" r="2.5" fill="#4a3a42" />
      <circle cx="300" cy="180" r="2.5" fill="#4a3a42" />
    </svg>
  );
}
