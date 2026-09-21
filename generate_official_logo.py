import subprocess
import os

svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1150 340" width="1150" height="340" fill="none">
  <defs>
    <!-- Gradients for Left Blue Emblem -->
    <linearGradient id="blueFront" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="40%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
    <linearGradient id="blueBevel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#082f49" />
    </linearGradient>
    <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e0f2fe" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>

    <!-- Gradients for Right Orange Emblem -->
    <linearGradient id="orangeFront" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="35%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#dc2626" />
    </linearGradient>
    <linearGradient id="orangeBevel" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ea580c" />
      <stop offset="100%" stop-color="#7c2d12" />
    </linearGradient>
    <linearGradient id="orangeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#f97316" />
    </linearGradient>

    <!-- Gradients for Typography -->
    <linearGradient id="mohabTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="45%" stop-color="#bae6fd" />
      <stop offset="85%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    
    <linearGradient id="mohammedTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="35%" stop-color="#fb923c" />
      <stop offset="80%" stop-color="#ea580c" />
      <stop offset="100%" stop-color="#b91c1c" />
    </linearGradient>

    <!-- Ribbon Gradient -->
    <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#03152d" />
      <stop offset="25%" stop-color="#08295e" />
      <stop offset="50%" stop-color="#0e3a82" />
      <stop offset="75%" stop-color="#08295e" />
      <stop offset="100%" stop-color="#03152d" />
    </linearGradient>
    <linearGradient id="ribbonStroke" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.3" />
      <stop offset="30%" stop-color="#38bdf8" />
      <stop offset="70%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#f97316" stop-opacity="0.8" />
    </linearGradient>

    <!-- Filters -->
    <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="glowOrange" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="dropShadowDark" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="3" dy="6" stdDeviation="5" flood-color="#000000" flood-opacity="0.85" />
    </filter>
  </defs>

  <!-- BACKGROUND IS TRANSPARENT FOR SEAMLESS EMBEDDING -->

  <!-- ==================== LEFT 3D EMBLEM (INTERLOCKING M CHEVRONS) ==================== -->
  <g id="emblem-group" transform="translate(25, 20)">
    <!-- Speed streaks background for emblem -->
    <path d="M40 85 L15 110" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" opacity="0.6" />
    <path d="M50 60 L20 90" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" opacity="0.8" />
    <path d="M65 40 L35 70" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" opacity="0.7" />
    
    <path d="M190 140 L220 170" stroke="#f97316" stroke-width="4" stroke-linecap="round" opacity="0.7" />
    <path d="M180 165 L215 200" stroke="#f97316" stroke-width="6" stroke-linecap="round" opacity="0.9" />
    <path d="M165 190 L195 220" stroke="#f97316" stroke-width="4" stroke-linecap="round" opacity="0.6" />

    <!-- 1. LEFT CHEVRON (BLUE 3D) -->
    <!-- Extrusion / Bottom Depth -->
    <path d="M100 25 L100 45 L35 155 L35 135 Z" fill="#082f49" />
    <path d="M100 45 L130 95 L130 75 L100 25 Z" fill="#0c4a6e" />
    <path d="M35 155 L75 195 L75 175 L35 135 Z" fill="#0369a1" />
    <path d="M75 195 L100 150 L100 130 L75 175 Z" fill="#075985" />

    <!-- Main Front Face (Left Chevron) -->
    <path d="M100 20 L132 75 L95 135 L68 100 L45 138 L95 195 L155 95 L100 20 Z" 
          fill="url(#blueFront)" filter="url(#dropShadowDark)" />
    <!-- Blue Chevron Highlights -->
    <path d="M100 20 L132 75" stroke="url(#blueGlow)" stroke-width="3.5" stroke-linecap="round" />
    <path d="M100 20 L68 100" stroke="#e0f2fe" stroke-width="2.5" stroke-linecap="round" />

    <!-- 2. RIGHT OVERLAPPING CHEVRON (ORANGE/GOLD 3D) -->
    <!-- Extrusion / Bottom Depth -->
    <path d="M145 50 L145 72 L95 155 L95 135 Z" fill="#7c2d12" />
    <path d="M145 72 L190 148 L190 126 L145 50 Z" fill="#9a3412" />
    <path d="M95 155 L135 220 L135 198 L95 135 Z" fill="#c2410c" />
    
    <!-- Main Front Face (Right Chevron) -->
    <path d="M145 45 L192 125 L135 220 L102 165 L125 128 L95 135 L145 45 Z" 
          fill="url(#orangeFront)" filter="url(#dropShadowDark)" />
    <!-- Orange Chevron Highlights -->
    <path d="M145 45 L192 125" stroke="url(#orangeGlow)" stroke-width="4" stroke-linecap="round" />
    <path d="M135 220 L102 165" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" />

    <!-- Central Energy Spark / Core Interlock -->
    <circle cx="115" cy="115" r="7" fill="#ffffff" filter="url(#glowCyan)" />
  </g>

  <!-- ==================== TYPOGRAPHY: MOHAB MOHAMMED ==================== -->
  <g id="typography-group">
    
    <!-- LINE 1: "Mohab" -->
    <!-- Drop Shadow Layer -->
    <text x="248" y="118" 
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Impact, sans-serif" 
          font-weight="900" 
          font-style="italic" 
          font-size="94" 
          letter-spacing="2"
          fill="#020617" 
          opacity="0.9"
          filter="url(#dropShadowDark)">MOHAB</text>

    <!-- 3D Bevel/Extrusion Layer -->
    <text x="245" y="115" 
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Impact, sans-serif" 
          font-weight="900" 
          font-style="italic" 
          font-size="94" 
          letter-spacing="2"
          fill="#0369a1">MOHAB</text>

    <!-- Front Face Gradient -->
    <text x="242" y="112" 
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Impact, sans-serif" 
          font-weight="900" 
          font-style="italic" 
          font-size="94" 
          letter-spacing="2"
          fill="url(#mohabTextGrad)"
          stroke="#38bdf8"
          stroke-width="1.5">MOHAB</text>

    <!-- Ice/Cyan Glow Overlay Accent on MOHAB -->
    <path d="M242 75 Q320 65 420 70" stroke="#e0f2fe" stroke-width="3" stroke-linecap="round" opacity="0.85" filter="url(#glowCyan)" />
    <!-- Sparkle Stars -->
    <polygon points="238,55 241,63 249,66 241,69 238,77 235,69 227,66 235,63" fill="#ffffff" filter="url(#glowCyan)" />
    <polygon points="565,65 567,71 573,73 567,75 565,81 563,75 557,73 563,71" fill="#ffffff" filter="url(#glowCyan)" />

    <!-- LINE 2: "MOHAMMED" -->
    <!-- Drop Shadow Layer -->
    <text x="254" y="210" 
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Impact, sans-serif" 
          font-weight="900" 
          font-style="italic" 
          font-size="96" 
          letter-spacing="3"
          fill="#000000" 
          opacity="0.95"
          filter="url(#dropShadowDark)">MOHAMMED</text>

    <!-- 3D Bevel/Extrusion Layer -->
    <text x="250" y="206" 
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Impact, sans-serif" 
          font-weight="900" 
          font-style="italic" 
          font-size="96" 
          letter-spacing="3"
          fill="#9a3412">MOHAMMED</text>

    <!-- Front Face Gradient -->
    <text x="246" y="202" 
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Impact, sans-serif" 
          font-weight="900" 
          font-style="italic" 
          font-size="96" 
          letter-spacing="3"
          fill="url(#mohammedTextGrad)"
          stroke="#ea580c"
          stroke-width="1.5">MOHAMMED</text>

    <!-- Fiery Underline Swoosh / Brush Streak -->
    <path d="M370 216 C 520 218, 720 215, 870 205 C 770 226, 560 228, 370 216 Z" 
          fill="url(#orangeFront)" filter="url(#glowOrange)" />
    <path d="M410 219 C 550 221, 710 218, 830 210" 
          stroke="#fef08a" stroke-width="2" stroke-linecap="round" />
  </g>

  <!-- ==================== LOWER 3D METALLIC RIBBON BANNER ==================== -->
  <g id="ribbon-group" transform="translate(190, 248)">
    <!-- Left Wing End Fin -->
    <polygon points="0,22 -25,22 -35,10 -15,0 0,0" fill="#0284c7" opacity="0.8" />
    <polygon points="0,22 -15,36 -35,26 -20,22" fill="#0369a1" />

    <!-- Right Wing End Fin -->
    <polygon points="900,0 915,0 935,12 925,24 900,24" fill="#ea580c" opacity="0.8" />
    <polygon points="900,24 925,24 935,36 915,36" fill="#c2410c" />

    <!-- Ribbon Base Plate with Shadow -->
    <rect x="0" y="0" width="900" height="46" rx="23" 
          fill="url(#ribbonGrad)" 
          stroke="url(#ribbonStroke)" 
          stroke-width="2.5" 
          filter="url(#dropShadowDark)" />

    <!-- Top Metallic Bevel Highlight -->
    <path d="M25 4 L875 4" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" opacity="0.7" />

    <!-- Exact Tagline from User Image: Graphic Designer • AI Creative • Photoshop Expert • Visual Designer -->
    <g transform="translate(450, 29)" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="19" font-weight="800" letter-spacing="0.5">
      <text y="0">
        <!-- 1. Graphic Designer -->
        <tspan fill="#ffffff">Graphic Designer</tspan>
        <!-- Separator 1 -->
        <tspan fill="#f97316" font-size="24" font-weight="900" dy="-1"> • </tspan>
        <!-- 2. AI Creative -->
        <tspan fill="#38bdf8" dy="1">AI Creative</tspan>
        <!-- Separator 2 -->
        <tspan fill="#f97316" font-size="24" font-weight="900" dy="-1"> • </tspan>
        <!-- 3. Photoshop Expert -->
        <tspan fill="#ffffff" dy="1">Photoshop Expert</tspan>
        <!-- Separator 3 -->
        <tspan fill="#f97316" font-size="24" font-weight="900" dy="-1"> • </tspan>
        <!-- 4. Visual Designer -->
        <tspan fill="#facc15" dy="1">Visual Designer</tspan>
      </text>
    </g>
  </g>
</svg>'''

with open("public/assets/images/mohab_logo.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

with open("src/assets/images/mohab_logo.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

print("SVG generated successfully!")

# Now use convert to render high-resolution PNG and JPG
cmd_png = ["convert", "-background", "none", "-density", "300", "public/assets/images/mohab_logo.svg", "public/assets/images/mohab_logo.png"]
cmd_jpg = ["convert", "-background", "#070c14", "-flatten", "-density", "300", "public/assets/images/mohab_logo.svg", "public/assets/images/mohab_logo.jpg"]

subprocess.run(cmd_png, check=True)
subprocess.run(cmd_jpg, check=True)

# Also copy to src/assets/images
subprocess.run(["cp", "public/assets/images/mohab_logo.png", "src/assets/images/mohab_logo.png"], check=True)
subprocess.run(["cp", "public/assets/images/mohab_logo.jpg", "src/assets/images/mohab_logo.jpg"], check=True)

print("PNG and JPG rendered and synced successfully!")
