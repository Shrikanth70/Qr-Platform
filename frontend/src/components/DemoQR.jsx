import React from 'react';

// Generates a highly distinct mock QR matrix based exactly on selected styles.
function DemoQR({ pattern, fgColor, bgColor }) {
  const isRounded = pattern === 'Rounded';
  const isBold = pattern === 'Bold';
  const isMinimal = pattern === 'Minimal';
  const hasLogo = pattern === 'Logo Center';

  // Make shapes VISIBLY different exactly as requested
  const rx = isRounded ? '50%' : '0%';
  
  // Grid constraint
  const gridSize = 21;
  const cellSize = 100 / gridSize;

  const elements = [];

  // Distinct Finder Pattern Drawing
  const drawFinder = (startX, startY) => {
    // Outer bold box
    elements.push(
      <rect key={`finder_out_${startX}_${startY}`} 
        x={`${startX * cellSize}%`} y={`${startY * cellSize}%`} 
        width={`${7 * cellSize}%`} height={`${7 * cellSize}%`} 
        rx={rx} fill={fgColor} 
      />
    );
    // Inner gap
    elements.push(
      <rect key={`finder_in_${startX}_${startY}`} 
        x={`${(startX + 1) * cellSize}%`} y={`${(startY + 1) * cellSize}%`} 
        width={`${5 * cellSize}%`} height={`${5 * cellSize}%`} 
        rx={rx} fill={bgColor} 
      />
    );
    // Center dot
    elements.push(
      <rect key={`finder_dot_${startX}_${startY}`} 
        x={`${(startX + 2.5) * cellSize}%`} y={`${(startY + 2.5) * cellSize}%`} 
        width={`${2 * cellSize}%`} height={`${2 * cellSize}%`} 
        rx={rx} fill={fgColor} 
      />
    );
  };

  // 3 standard corners
  drawFinder(0, 0); // Top left
  drawFinder(gridSize - 7, 0); // Top right
  drawFinder(0, gridSize - 7); // Bottom left

  // Hash-based deterministic pattern seeding
  const generateHash = (x, y) => (x * 17 + y * 31) % 9;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      // Exclude finders
      if ((x < 8 && y < 8) || (x > gridSize - 8 && y < 8) || (x < 8 && y > gridSize - 8)) {
        continue;
      }
      
      // Exclude center if Logo Center selected
      if (hasLogo && (x >= 8 && x <= 12 && y >= 8 && y <= 12)) {
        continue;
      }

      // Density threshold mapping 
      let threshold = 4;
      if (isBold) threshold = 6;     // Denser rendering
      if (isMinimal) threshold = 3;  // Sparser rendering
      
      if (generateHash(x, y) < threshold) {
        
        // Size of individual element
        let w = cellSize;
        let h = cellSize;
        let offsetX = x * cellSize;
        let offsetY = y * cellSize;

        if (isBold) {
          // Bloated merged look
          w = cellSize * 1.1;
          h = cellSize * 1.1;
          offsetX -= cellSize * 0.05;
          offsetY -= cellSize * 0.05;
          elements.push(
            <rect key={`rect_${x}_${y}`} x={`${offsetX}%`} y={`${offsetY}%`} width={`${w}%`} height={`${h}%`} fill={fgColor} />
          );
        } else if (isMinimal) {
          // Tiny floating isolated dots
          const r = cellSize * 0.35;
          elements.push(
            <circle key={`dot_${x}_${y}`} cx={`${(x + 0.5) * cellSize}%`} cy={`${(y + 0.5) * cellSize}%`} r={`${r}%`} fill={fgColor} />
          );
        } else {
          // Classic or Rounded pill/blocks
          elements.push(
            <rect key={`rect_${x}_${y}`} x={`${offsetX}%`} y={`${offsetY}%`} width={`${w}%`} height={`${h}%`} rx={rx} fill={fgColor} />
          );
        }
      }
    }
  }

  // Inject beautiful distinct center icon if style selected
  if (hasLogo) {
    elements.push(
      <rect key="logo_bg" x={`${8 * cellSize}%`} y={`${8 * cellSize}%`} width={`${5 * cellSize}%`} height={`${5 * cellSize}%`} rx="15%" fill={bgColor} />
    );
    // Draw a generic image icon shape inside the cutout
    elements.push(
      <circle key="logo_head" cx={`${10.5 * cellSize}%`} cy={`${10 * cellSize}%`} r={`${0.8 * cellSize}%`} fill="#3b82f6" opacity="0.9" />
    );
    elements.push(
      <path key="logo_body" d={`M ${9 * cellSize} ${11.5 * cellSize} Q ${10.5 * cellSize} ${9.5 * cellSize} ${12 * cellSize} ${11.5 * cellSize} Z`} fill="#3b82f6" opacity="0.9" />
    );
  }

  return (
    <div className="w-full aspect-square bg-white shadow-xl shadow-black/20 p-2 md:p-3 border-[3px] border-slate-700/50" 
         style={{ backgroundColor: bgColor, borderRadius: isRounded ? '24px' : '12px' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-full h-full block"
        shapeRendering="geometricPrecision"
      >
        {elements}
      </svg>
    </div>
  );
}

export default DemoQR;
