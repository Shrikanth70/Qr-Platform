import React from 'react';

function QRRenderer({ matrix, pattern, fgColor, bgColor, logoUrl, size }) {
  const isRounded = pattern === 'Rounded';
  const isBold = pattern === 'Bold';
  const isMinimal = pattern === 'Minimal';
  
  // Visual rounding constraints
  const rx = isRounded ? '50%' : '0%';
  
  const activeMatrix = matrix || [];
  const gridSize = activeMatrix.length > 0 ? activeMatrix.length : 25;
  const cellSize = 100 / gridSize;

  const getSimulatedCell = (x, y) => {
    return ((x * 17 + y * 31) % 9) < (isBold ? 6 : (isMinimal ? 3 : 4));
  };

  const elements = [];

  // Dedicated rigid finders
  const drawFinder = (startX, startY) => {
    elements.push(
      <rect key={`finder_out_${startX}_${startY}`} 
        x={`${startX * cellSize}%`} y={`${startY * cellSize}%`} 
        width={`${7 * cellSize}%`} height={`${7 * cellSize}%`} 
        rx={rx} fill={fgColor} 
      />
    );
    elements.push(
      <rect key={`finder_in_${startX}_${startY}`} 
        x={`${(startX + 1) * cellSize}%`} y={`${(startY + 1) * cellSize}%`} 
        width={`${5 * cellSize}%`} height={`${5 * cellSize}%`} 
        rx={rx} fill={bgColor} 
      />
    );
    elements.push(
      <rect key={`finder_dot_${startX}_${startY}`} 
        x={`${(startX + 2.5) * cellSize}%`} y={`${(startY + 2.5) * cellSize}%`} 
        width={`${2 * cellSize}%`} height={`${2 * cellSize}%`} 
        rx={rx} fill={fgColor} 
      />
    );
  };

  if (!matrix) {
     drawFinder(0, 0); 
     drawFinder(gridSize - 7, 0); 
     drawFinder(0, gridSize - 7); 
  }

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      
      const isCornerArea = (x <= 7 && y <= 7) || (x >= gridSize - 8 && y <= 7) || (x <= 7 && y >= gridSize - 8);
      if (!matrix && isCornerArea) continue; // Skip since we drew them perfectly above for demo

      const isSolid = matrix ? matrix[y][x] : getSimulatedCell(x, y);
      if (!isSolid) continue;

      // Logo safe zone (Center cutout)
      if (logoUrl) {
         const centerSafeZone = Math.floor(gridSize * 0.35); // Big responsive center zone
         if (x >= centerSafeZone && x <= gridSize - centerSafeZone && y >= centerSafeZone && y <= gridSize - centerSafeZone) {
           continue; // Cut out the dots for the image!
         }
      } else if (pattern === 'Logo Center') {
         // Placeholder visual cut if no actual logo supplied
         const centerSafeZone = Math.floor(gridSize * 0.4);
         if (x >= centerSafeZone && x <= gridSize - centerSafeZone && y >= centerSafeZone && y <= gridSize - centerSafeZone) {
           continue; 
         }
      }

      // Calculate localized rendering block bounds
      let w = cellSize;
      let h = cellSize;
      let offsetX = x * cellSize;
      let offsetY = y * cellSize;
      
      let rectNode;

      if (isBold) {
        w = cellSize * 1.15;
        h = cellSize * 1.15;
        offsetX -= cellSize * 0.075;
        offsetY -= cellSize * 0.075;
        rectNode = <rect key={`r_${x}_${y}`} x={`${offsetX}%`} y={`${offsetY}%`} width={`${w}%`} height={`${h}%`} fill={fgColor} />;
      } else if (isMinimal) {
        const r = cellSize * 0.35;
        rectNode = <circle key={`d_${x}_${y}`} cx={`${(x + 0.5) * cellSize}%`} cy={`${(y + 0.5) * cellSize}%`} r={`${r}%`} fill={fgColor} />;
      } else {
        rectNode = <rect key={`r_${x}_${y}`} x={`${offsetX}%`} y={`${offsetY}%`} width={`${w}%`} height={`${h}%`} rx={rx} fill={fgColor} />;
      }

      elements.push(rectNode);
    }
  }

  const renderLogo = () => {
    if (logoUrl) {
      const centerW = 26; // Covers 26% of center width
      const centerPos = 50 - (centerW / 2);
      return (
        <g key="user_logo_group">
           <rect x={`${centerPos - 1}%`} y={`${centerPos - 1}%`} width={`${centerW + 2}%`} height={`${centerW + 2}%`} fill={bgColor} rx="15%" />
           <image href={logoUrl} x={`${centerPos}%`} y={`${centerPos}%`} width={`${centerW}%`} height={`${centerW}%`} preserveAspectRatio="xMidYMid slice" clipPath="inset(0% round 10%)" />
        </g>
      );
    } else if (pattern === 'Logo Center') {
      const centerSafeR = Math.floor(gridSize * 0.15) * cellSize;
      return (
        <g key="dummy_logo_group">
          <rect x={`${50 - centerSafeR}%`} y={`${50 - centerSafeR}%`} width={`${centerSafeR*2}%`} height={`${centerSafeR*2}%`} rx="15%" fill={bgColor} />
          <path d={`M 50 ${50 + centerSafeR*0.3} l -${centerSafeR*0.4} -${centerSafeR*0.6} h ${centerSafeR*0.8} Z`} fill="#3b82f6" />
        </g>
      );
    }
    return null;
  };

  return (
    <div 
      className="w-full aspect-square bg-white shadow-xl shadow-black/20 p-2 md:p-3 border-[3px] border-slate-700/50 relative overflow-hidden group" 
      style={{ backgroundColor: bgColor, borderRadius: isRounded ? '24px' : '12px' }}
    >
      <svg
        id="qr-render-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width={size ? parseInt(size, 10) : 512}
        height={size ? parseInt(size, 10) : 512}
        style={{ width: '100%', height: '100%', display: 'block' }}
        shapeRendering="geometricPrecision"
      >
        <g>
          {elements}
        </g>
        {renderLogo()}
      </svg>
    </div>
  );
}

export default QRRenderer;
