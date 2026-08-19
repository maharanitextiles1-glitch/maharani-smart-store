import type { Section } from "../types";

type Props = {
  width: number;
  height: number;
  sections: Section[];
  landmarks: any[];
  selectedSectionId?: string;
  path?: any[];
};

export function ShowroomMap({
  width,
  height,
  sections,
  landmarks,
  selectedSectionId,
  path = [],
}: Props) {
  const points = path
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  const entrance = landmarks?.find(
    (l: any) => l.type === "entrance"
  );

  return (
    <div className="overflow-auto rounded-[28px] border border-[#d7bd78]/20 bg-white shadow-sm">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[760px] bg-[#fffdf8]"
      >
        <defs>
          <filter
            id="softShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="8"
              floodOpacity="0.10"
            />
          </filter>

          <marker
            id="routeArrow"
            markerWidth="12"
            markerHeight="12"
            refX="8"
            refY="4"
            orient="auto"
          >
            <path
              d="M0,0 L0,8 L9,4 z"
              fill="#b68a3a"
            />
          </marker>
        </defs>

        <rect
          x="12"
          y="12"
          width={width - 24}
          height={height - 24}
          rx="34"
          fill="#fffdf8"
          stroke="#eadcc0"
          strokeWidth="4"
        />

        {sections.map((section) => {
          const active =
            section._id === selectedSectionId;

          const p = section.mapPosition;

          return (
            <g
              key={section._id}
              filter="url(#softShadow)"
            >
              <rect
                x={p.x}
                y={p.y}
                width={p.width}
                height={p.height}
                rx="26"
                fill={
                  active
                    ? "#651d2c"
                    : "#f7f0e5"
                }
                stroke={
                  active
                    ? "#b68a3a"
                    : "#ddcaa7"
                }
                strokeWidth={active ? 6 : 3}
              />

              <text
                x={p.x + p.width / 2}
                y={
                  p.y +
                  p.height / 2 -
                  8
                }
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="27"
                fontWeight="700"
                fill={
                  active
                    ? "#ffffff"
                    : "#2f2524"
                }
              >
                {section.name}
              </text>

              <text
                x={p.x + p.width / 2}
                y={
                  p.y +
                  p.height / 2 +
                  27
                }
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="18"
                fontWeight="600"
                fill={
                  active
                    ? "#e5c77b"
                    : "#8a6f49"
                }
              >
                {section.code}
              </text>
            </g>
          );
        })}

        {points && (
          <polyline
            points={points}
            fill="none"
            stroke="#b68a3a"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="20 16"
            markerEnd="url(#routeArrow)"
          />
        )}

        {landmarks?.map((landmark: any) => (
          <g key={landmark.key}>
            <circle
              cx={landmark.x}
              cy={landmark.y}
              r="15"
              fill="#2f2524"
              stroke="#ffffff"
              strokeWidth="5"
            />

            <text
              x={landmark.x}
              y={landmark.y - 27}
              textAnchor="middle"
              fontSize="20"
              fontWeight="700"
              fill="#2f2524"
            >
              {landmark.label}
            </text>
          </g>
        ))}

        {entrance && (
          <g>
            <circle
              cx={entrance.x}
              cy={entrance.y}
              r="30"
              fill="#651d2c"
              opacity="0.15"
            />

            <circle
              cx={entrance.x}
              cy={entrance.y}
              r="12"
              fill="#651d2c"
            />

            <text
              x={entrance.x}
              y={entrance.y + 50}
              textAnchor="middle"
              fontSize="18"
              fontWeight="800"
              fill="#651d2c"
            >
              YOU ARE HERE
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}