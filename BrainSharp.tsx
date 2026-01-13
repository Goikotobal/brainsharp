import React, { useState, useEffect } from 'react';

// ==================== TYPES ====================

type Category = 'nature' | 'disaster' | 'medical' | 'wildlife' | 'extreme';
type Difficulty = 'beginner' | 'intermediate' | 'expert';
type Outcome = 'optimal' | 'good' | 'poor' | 'fatal';

interface Choice {
  id: string;
  text: string;
  outcome: Outcome;
  explanation: string;
  score: number;
  consequences?: string;
}

interface Scenario {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  emoji: string;
  situation: string;
  context: {
    location: string;
    conditions: string[];
    resources: string[];
    timeLimit?: string;
  };
  choices: Choice[];
  expertTip?: string;
}

interface GameState {
  currentScenario: Scenario | null;
  selectedChoice: Choice | null;
  totalScore: number;
  scenariosCompleted: number;
  lives: number;
  gameOver: boolean;
  showResult: boolean;
}

// ==================== SCENARIOS DATABASE ====================

const SCENARIOS: Scenario[] = [
  {
    id: 'mountain-blizzard',
    title: 'Mountain Blizzard',
    category: 'nature',
    difficulty: 'intermediate',
    emoji: '🏔️',
    situation: "You're hiking at 3,000m altitude when a sudden blizzard hits. Temperature is -15°C and dropping rapidly. Visibility is less than 10 meters, and it's 4:30 PM with sunset in 30 minutes.",
    context: {
      location: "Rocky Mountain Trail, 3,000m elevation",
      conditions: [
        "Temperature: -15°C (dropping)",
        "Visibility: <10 meters",
        "Wind: 60 km/h gusts",
        "Sunset: 30 minutes"
      ],
      resources: [
        "Light jacket (not winter-rated)",
        "Phone (20% battery, no signal)",
        "Water bottle (half full)",
        "2 energy bars",
        "Small flashlight"
      ],
      timeLimit: "Immediate decision required"
    },
    choices: [
      {
        id: 'a',
        text: "Keep hiking down quickly to find shelter before dark",
        outcome: 'fatal',
        score: -50,
        explanation: "CRITICAL ERROR: Moving in a blizzard with poor visibility is extremely dangerous. You could easily get disoriented, fall off a cliff, or exhaust yourself. The cold and wind chill would accelerate hypothermia.",
        consequences: "High risk of fatal accident or severe hypothermia"
      },
      {
        id: 'b',
        text: "Find immediate shelter (rocks/trees) and wait out the storm",
        outcome: 'optimal',
        score: 100,
        explanation: "CORRECT! This is the safest choice. Finding shelter immediately protects you from wind and snow. Use your body heat wisely, stay dry, and wait for conditions to improve. Most mountain rescue teams advise staying put in these conditions.",
        consequences: "Safe shelter, conserve energy, rescue likely in morning"
      },
      {
        id: 'c',
        text: "Use phone to call emergency services (may drain battery)",
        outcome: 'good',
        score: 60,
        explanation: "ACCEPTABLE: Calling for help is reasonable, but with only 20% battery and no signal, it may not work. Better to first find shelter, then try calling while conserving battery for potential signal later.",
        consequences: "May get help but battery drains quickly"
      },
      {
        id: 'd',
        text: "Start a fire to stay warm and signal your location",
        outcome: 'poor',
        score: 20,
        explanation: "RISKY: In a blizzard with 60 km/h winds, starting a fire is nearly impossible. Wet conditions and high winds make this impractical. You'd waste precious energy and resources. Focus on shelter first.",
        consequences: "Wastes time and energy, unlikely to succeed"
      }
    ],
    expertTip: "In mountain emergencies: Shelter > Fire > Signal. Always prioritize protection from elements."
  },
  
  {
    id: 'desert-heatwave',
    title: 'Desert Heat Stroke',
    category: 'extreme',
    difficulty: 'expert',
    emoji: '🏜️',
    situation: "Your vehicle broke down in the Mojave Desert at noon. Temperature is 48°C (118°F) in the shade. You're 40km from the nearest town. You have limited water and no cell signal.",
    context: {
      location: "Mojave Desert, California - 40km from civilization",
      conditions: [
        "Temperature: 48°C (118°F)",
        "No shade except car",
        "Sun: 6 more hours of intense heat",
        "Humidity: 10%"
      ],
      resources: [
        "2 liters of water",
        "Car with fuel but won't start",
        "Phone (no signal)",
        "Sunglasses and hat",
        "Road map"
      ],
      timeLimit: "Next 2-3 hours critical"
    },
    choices: [
      {
        id: 'a',
        text: "Walk toward town now while you have energy",
        outcome: 'fatal',
        score: -100,
        explanation: "DEADLY MISTAKE: Walking 40km in 48°C heat is a death sentence. You'd need 15+ liters of water for this distance in such heat. Heat stroke would occur within 2-3 hours. Your body loses water faster than you can drink.",
        consequences: "Severe dehydration, heat stroke, likely fatal within hours"
      },
      {
        id: 'b',
        text: "Stay with vehicle, create shade, ration water until evening",
        outcome: 'optimal',
        score: 100,
        explanation: "CORRECT! The #1 rule in desert survival: STAY WITH YOUR VEHICLE. It's easier to spot from air, provides shade, and has materials for signaling. Evening walking is safer. Use car parts to create extra shade and signal mirrors.",
        consequences: "Maximize survival time, increase rescue chances dramatically"
      },
      {
        id: 'c',
        text: "Drink all water now to stay hydrated for walking later",
        outcome: 'poor',
        score: 10,
        explanation: "WRONG APPROACH: Your body can only absorb about 1 liter per hour. Drinking all 2L at once will just make you urinate, wasting water. Sip small amounts regularly. Never drink all water at once in survival situations.",
        consequences: "Waste water through excess urination, false sense of hydration"
      },
      {
        id: 'd',
        text: "Use car battery to make smoke signals",
        outcome: 'good',
        score: 70,
        explanation: "CREATIVE BUT RISKY: While signaling is good, burning car materials creates toxic fumes in confined space. Better to use mirrors, headlights (flash SOS), or hubcaps as reflectors. Save battery for potential evening use.",
        consequences: "May attract attention but risk of toxic fume inhalation"
      }
    ],
    expertTip: "Desert survival rule: 3 hours in extreme heat without shade, 3 days without water. Vehicle = life."
  },

  {
    id: 'bear-encounter',
    title: 'Grizzly Bear Encounter',
    category: 'wildlife',
    difficulty: 'intermediate',
    emoji: '🐻',
    situation: "You're hiking alone when you round a corner and see a grizzly bear 30 meters ahead, eating berries. The bear hasn't noticed you yet. You have bear spray on your belt. Dense forest on both sides, trail behind you.",
    context: {
      location: "Yellowstone National Park trail",
      conditions: [
        "Distance: 30 meters",
        "Bear: Adult grizzly, eating",
        "Bear hasn't noticed you",
        "Wind: Light breeze toward you"
      ],
      resources: [
        "Bear spray (full canister)",
        "Hiking poles",
        "Backpack with food",
        "Whistle"
      ],
      timeLimit: "Seconds before bear may notice"
    },
    choices: [
      {
        id: 'a',
        text: "Slowly back away while making soft sounds to announce presence",
        outcome: 'optimal',
        score: 100,
        explanation: "CORRECT! This is textbook bear safety. Slowly backing away while making calm, non-threatening sounds lets the bear know you're human. Never surprise a bear. Don't run (triggers chase instinct). Stay calm and create distance.",
        consequences: "Bear likely continues eating, you safely retreat"
      },
      {
        id: 'b',
        text: "Run back down the trail as fast as possible",
        outcome: 'fatal',
        score: -50,
        explanation: "CRITICAL ERROR: Running triggers a bear's chase instinct. Grizzlies can run 55 km/h - you cannot outrun them. This turns a non-aggressive situation into a dangerous chase. Never run from bears.",
        consequences: "Bear chases, high probability of attack"
      },
      {
        id: 'c',
        text: "Immediately spray bear spray in bear's direction",
        outcome: 'poor',
        score: 20,
        explanation: "TOO AGGRESSIVE: Bear spray is for charging bears, not calm ones eating. At 30m, spray won't reach (effective range: 5-7m). Wind toward you means you'd spray yourself. Save spray for actual threats.",
        consequences: "Waste spray, possibly spray yourself, may agitate bear"
      },
      {
        id: 'd',
        text: "Stand still, don't move, wait for bear to leave",
        outcome: 'good',
        score: 70,
        explanation: "ACCEPTABLE: Standing still is better than running, but backing away slowly is safer. If bear hasn't seen you, there's no need to stay. Quietly creating distance reduces all risk. Standing still works but is unnecessarily risky if surprised.",
        consequences: "Probably safe but prolongs risky situation unnecessarily"
      }
    ],
    expertTip: "Bear safety: If it's brown (grizzly), back down. If it's black, fight back. If it's white (polar), goodnight."
  },

  {
    id: 'flash-flood',
    title: 'Canyon Flash Flood',
    category: 'disaster',
    difficulty: 'expert',
    emoji: '🌊',
    situation: "You're hiking in a narrow slot canyon when you notice water starting to flow at your feet. Dark clouds are visible upstream. The canyon walls are 15 meters high and smooth. Closest exit is 200 meters ahead or 300 meters back.",
    context: {
      location: "Antelope Canyon, Arizona - narrow slot canyon",
      conditions: [
        "Water rising: 2cm every 30 seconds",
        "Canyon width: 2 meters",
        "Wall height: 15 meters (smooth)",
        "Thunder heard upstream"
      ],
      resources: [
        "Rope (10 meters)",
        "Climbing harness (basic)",
        "Waterproof backpack",
        "Headlamp"
      ],
      timeLimit: "Flash flood imminent (2-5 minutes)"
    },
    choices: [
      {
        id: 'a',
        text: "Run forward 200m to nearest exit immediately",
        outcome: 'optimal',
        score: 100,
        explanation: "CORRECT! Flash floods can arrive in minutes with walls of water 3-6 meters high moving 15+ km/h. Every second counts. The 200m exit ahead is your best chance. Run with everything you have. Don't look back. Drop gear if needed for speed.",
        consequences: "Best survival chance, may reach exit before main flood hits"
      },
      {
        id: 'b',
        text: "Try to climb the smooth canyon walls using rope",
        outcome: 'fatal',
        score: -100,
        explanation: "DEADLY MISTAKE: Slot canyon walls are smooth and often overhanging. With only 10m of rope and 15m walls, this is impossible. Flash floods can arrive in under 2 minutes. You'd be caught mid-climb. NEVER climb in slot canyons during flash flood warning.",
        consequences: "Trapped on wall when flood hits, swept away with high impact injuries"
      },
      {
        id: 'c',
        text: "Go back 300m to previous exit (farther but known)",
        outcome: 'poor',
        score: 30,
        explanation: "RISKY CHOICE: 300m is 50% farther than forward exit. In flash flood scenarios, every meter matters. While going back is familiar, the extra 100m could be fatal. Flash floods move faster than humans can run. Forward is your best bet.",
        consequences: "May not make it in time, flood could overtake you"
      },
      {
        id: 'd',
        text: "Find a high ledge or alcove to wait out the flood",
        outcome: 'good',
        score: 60,
        explanation: "CONDITIONAL: Only viable if you spot a solid ledge above flood line (minimum 4-5 meters up) within 20 seconds. Most slot canyons lack these. If you're certain of a high alcove, this works. Otherwise, RUN to exit. Don't gamble on finding shelter.",
        consequences: "Safe if ledge exists and is high enough, otherwise fatal"
      }
    ],
    expertTip: "Flash flood survival: Distance > Height. Running to exit beats climbing. Floods can reach 20+ feet in slot canyons."
  },

  {
    id: 'snake-bite',
    title: 'Venomous Snake Bite',
    category: 'medical',
    difficulty: 'intermediate',
    emoji: '🐍',
    situation: "Your hiking partner was just bitten by a rattlesnake on their calf. Two puncture wounds visible, slight swelling starting. You're 2 hours from the trailhead and nearest hospital. Partner is conscious but anxious. No cell signal.",
    context: {
      location: "Desert trail, 2 hours from civilization",
      conditions: [
        "Bite location: Lower calf",
        "Time since bite: 30 seconds",
        "Victim: Conscious, anxious",
        "Temperature: 32°C"
      ],
      resources: [
        "First aid kit (bandages, antiseptic)",
        "Water (2 liters)",
        "Car keys (2 hour hike to car)",
        "Phone (no signal)"
      ],
      timeLimit: "First hour critical for venom spread"
    },
    choices: [
      {
        id: 'a',
        text: "Cut an X over bite and try to suck out venom",
        outcome: 'fatal',
        score: -80,
        explanation: "DANGEROUS MYTH: This is an old movie myth that can kill. Cutting increases infection risk and bleeding. Sucking venom is ineffective (venom enters bloodstream instantly) and you risk poisoning yourself. NEVER cut or suck snake bites.",
        consequences: "Severe infection, increased bleeding, venom spreads faster, no benefit"
      },
      {
        id: 'b',
        text: "Keep victim calm, immobilize leg below heart level, hike to car steadily",
        outcome: 'optimal',
        score: 100,
        explanation: "CORRECT! This is proper snake bite protocol: 1) Keep victim calm (anxiety speeds venom spread), 2) Immobilize affected limb below heart, 3) Remove jewelry/tight clothes, 4) Walk steadily to help. Don't run - increases heart rate and venom circulation.",
        consequences: "Minimizes venom spread, best survival outcome, hospital within 3 hours"
      },
      {
        id: 'c',
        text: "Apply tourniquet above bite to stop venom spread",
        outcome: 'poor',
        score: 10,
        explanation: "OUTDATED PRACTICE: Tourniquets can cause more harm than venom. They can lead to tissue death, compartment syndrome, and may require amputation. Modern snake bite treatment never uses tourniquets. Keep blood flowing slowly, not stopped.",
        consequences: "Risk of amputation, tissue death, doesn't stop venom effectively"
      },
      {
        id: 'd',
        text: "Run to car as fast as possible to get to hospital quicker",
        outcome: 'poor',
        score: 20,
        explanation: "COUNTERPRODUCTIVE: Running increases heart rate (80-120 bpm → 140+ bpm), which pumps venom through body faster. Rattlesnake bites are rarely fatal if treated within 6 hours. Steady walking gets you help without accelerating venom spread.",
        consequences: "Venom spreads 2-3x faster, symptoms worsen, exhaustion risks collapse"
      }
    ],
    expertTip: "Snake bite protocol: Calm, immobilize, below heart level, steady walk. Never: cut, suck, tourniquet, or ice."
  },

  {
    id: 'avalanche',
    title: 'Avalanche Burial',
    category: 'disaster',
    difficulty: 'expert',
    emoji: '⛷️',
    situation: "You're caught in an avalanche while backcountry skiing. You're being swept downhill in snow. You can still move your arms. The avalanche is slowing down. You need to act in the next 5 seconds before it stops and hardens.",
    context: {
      location: "Backcountry ski area, Canadian Rockies",
      conditions: [
        "Avalanche speed decreasing",
        "Arms still mobile",
        "3-5 seconds until full stop",
        "Depth: Unknown, likely 1-3 meters"
      ],
      resources: [
        "Avalanche beacon (transmitting)",
        "Arms still free",
        "Helmet on",
        "One pole still attached"
      ],
      timeLimit: "3-5 seconds before snow hardens"
    },
    choices: [
      {
        id: 'a',
        text: "Swim upward toward surface using swimming motions",
        outcome: 'good',
        score: 70,
        explanation: "GOOD EFFORT: Swimming motions can help in the flowing phase, but avalanche snow is much denser than water. It helps slightly but isn't the priority. Better than nothing, but creating air pocket is critical for survival.",
        consequences: "May help stay near surface, but not the most crucial action"
      },
      {
        id: 'b',
        text: "Create air pocket in front of face with hand before snow hardens",
        outcome: 'optimal',
        score: 100,
        explanation: "CRITICAL ACTION: This is the #1 survival priority in avalanche burial. Cup hands in front of your face to create an air pocket when snow stops. This gives you 15-30 minutes of breathable air vs. 5-10 minutes without it. Most avalanche deaths are from suffocation, not trauma.",
        consequences: "Maximizes survival time to 30+ minutes for rescue, prevents immediate suffocation"
      },
      {
        id: 'c',
        text: "Try to grab onto rocks or trees to stop movement",
        outcome: 'poor',
        score: 30,
        explanation: "RISKY: While stopping seems logical, avalanches have tremendous force (several tons). Grabbing obstacles can cause severe arm injuries or dislocations. Avalanche force will rip you away. Focus on air pocket instead.",
        consequences: "Arm injuries likely, won't stop avalanche, wastes critical seconds"
      },
      {
        id: 'd',
        text: "Spit to determine which way is up, then dig toward surface",
        outcome: 'fatal',
        score: -50,
        explanation: "DEADLY DELAY: While 'spit test' works, avalanche snow hardens like concrete in seconds. By the time you spit and assess, it's too hard to dig. You'd waste your air pocket formation time. ALWAYS prioritize air pocket FIRST, then assess orientation.",
        consequences: "No time to dig, snow hardens, suffocation in 5-10 minutes"
      }
    ],
    expertTip: "Avalanche survival priority: 1) Air pocket creation 2) Stay calm (reduces O2 use) 3) Wait for rescue. Beacon + shovel companions = 90% survival if found in 15 min."
  },

  {
    id: 'lightning-storm',
    title: 'Lightning Strike Zone',
    category: 'disaster',
    difficulty: 'beginner',
    emoji: '⚡',
    situation: "You're on an exposed mountain ridge when a lightning storm rapidly approaches. Thunder and lightning are now less than 1 km away. You're 20 minutes from tree line below. Large boulders nearby. Your metal hiking poles are in hand.",
    context: {
      location: "Exposed mountain ridge, 3,400m elevation",
      conditions: [
        "Lightning strike distance: <1 km",
        "Time to treeline: 20 minutes",
        "Terrain: Exposed ridge with boulders",
        "Group: 4 people"
      ],
      resources: [
        "Metal hiking poles",
        "Backpacks with metal frames",
        "Rain jackets",
        "Emergency blankets"
      ],
      timeLimit: "Immediate - storm is here"
    },
    choices: [
      {
        id: 'a',
        text: "Drop metal items, crouch low on balls of feet, spread group out 20m apart",
        outcome: 'optimal',
        score: 100,
        explanation: "PERFECT RESPONSE: Lightning seeks the highest point and metal conducts. Drop all metal immediately. Crouching on balls of feet (lightning squat) minimizes ground contact and height. Spreading group prevents one strike hitting multiple people. This is textbook lightning safety.",
        consequences: "Minimizes strike risk, reduces ground current danger, group safety maximized"
      },
      {
        id: 'b',
        text: "Run down to treeline as fast as possible",
        outcome: 'fatal',
        score: -60,
        explanation: "EXTREMELY DANGEROUS: Running makes you taller (strike target), increases heart rate (worse if struck), and you remain exposed for 20 minutes. Lightning can strike the same area multiple times. People are struck while running more often than stationary.",
        consequences: "High strike probability, elevated profile, exhaustion, potential cardiac arrest if struck"
      },
      {
        id: 'c',
        text: "Shelter under large boulder overhang together as group",
        outcome: 'poor',
        score: 20,
        explanation: "RISKY: While overhead protection seems logical, large rocks can conduct lightning and cause ground current to arc. Grouping together means one strike could injure everyone. Better to be low and separated than together under rock.",
        consequences: "Ground current risk, entire group vulnerable to single strike"
      },
      {
        id: 'd',
        text: "Lie flat on ground to be lowest point",
        outcome: 'poor',
        score: 30,
        explanation: "WRONG TECHNIQUE: Lying flat maximizes ground contact. When lightning strikes nearby, electrical current spreads through ground. More contact = more current through body. Lightning squat minimizes ground contact while staying low.",
        consequences: "Maximum ground current exposure, increased injury severity if nearby strike"
      }
    ],
    expertTip: "Lightning safety: 30/30 rule - Seek shelter when time between flash and thunder is 30 seconds. Wait 30 minutes after last thunder to resume."
  },

  {
    id: 'quicksand',
    title: 'Quicksand Trap',
    category: 'nature',
    difficulty: 'intermediate',
    emoji: '🏖️',
    situation: "While hiking near a riverbed, you step into what seems like mud. You sink to your knees instantly and feel yourself still sinking. You have a backpack on. Your hiking partner is 10 meters away on solid ground with a rope.",
    context: {
      location: "Coastal mudflats, low tide",
      conditions: [
        "Sunk to knees (30cm deep)",
        "Still sinking slowly",
        "Mud consistency: Thick, soupy",
        "Partner: 10m away, has rope"
      ],
      resources: [
        "Backpack (10kg)",
        "Hiking poles",
        "Partner with 15m rope",
        "Solid ground 10m away"
      ],
      timeLimit: "10-15 minutes before waist-deep"
    },
    choices: [
      {
        id: 'a',
        text: "Panic and try to pull legs straight up with all force",
        outcome: 'fatal',
        score: -70,
        explanation: "WORST ACTION: Quicksand creates suction when you pull up. Violent upward force requires 100,000+ Newtons - impossible for human strength. You'll exhaust yourself, sink faster, and create stronger suction. Panic is your enemy in quicksand.",
        consequences: "Rapid exhaustion, faster sinking, increased suction, high panic = poor decisions"
      },
      {
        id: 'b',
        text: "Drop backpack, lean back to distribute weight, wiggle legs gently, have partner throw rope",
        outcome: 'optimal',
        score: 100,
        explanation: "TEXTBOOK RESCUE: Quicksand is denser than humans - you'll float if you spread weight. Dropping backpack removes 10kg pulling you down. Leaning back distributes weight like swimming. Gentle wiggling introduces water, reducing suction. Rope assist makes escape easy.",
        consequences: "Buoyancy works in your favor, suction reduced, safe extraction with rope"
      },
      {
        id: 'c',
        text: "Stay completely still and wait for partner to help",
        outcome: 'good',
        score: 60,
        explanation: "PARTIAL SOLUTION: Not moving is better than panicking, and you won't sink faster. However, staying still with heavy backpack means you'll sink to equilibrium point (waist-chest deep). Better to drop pack and redistribute weight. Stillness alone isn't enough.",
        consequences: "Slow sink continues until buoyancy equalizes, partner can help but harder to extract"
      },
      {
        id: 'd',
        text: "Take off backpack and throw it ahead to solid ground, use poles as leverage",
        outcome: 'poor',
        score: 40,
        explanation: "RISKY APPROACH: Throwing creates movement that can cause more sinking. Using poles as leverage pushes them into soft mud - they'll sink too. While dropping pack is right, the execution is wrong. Lean back and work with buoyancy, don't fight with leverage.",
        consequences: "May sink deeper from movement, poles sink into mud, loses balance"
      }
    ],
    expertTip: "Quicksand myth: You can't be sucked completely under. Reality: You'll float when weight is distributed. Lean back, spread out, gentle movements."
  },

  {
    id: 'rip-current',
    title: 'Rip Current Survival',
    category: 'nature',
    difficulty: 'beginner',
    emoji: '🌊',
    situation: "You're swimming at the beach when you suddenly feel a strong current pulling you away from shore. You're a moderate swimmer. The beach is getting farther away despite swimming toward it. You're 50 meters from shore now.",
    context: {
      location: "Ocean beach, calm day with hidden rip current",
      conditions: [
        "Distance from shore: 50 meters (increasing)",
        "Current speed: 2-3 m/s",
        "Your swimming: 1 m/s",
        "Energy level: 70% (tiring)"
      ],
      resources: [
        "Swimming ability: Moderate",
        "Energy: Decreasing",
        "Lifeguard: 200m down beach",
        "Other swimmers nearby"
      ],
      timeLimit: "Energy depleting in 5-10 minutes"
    },
    choices: [
      {
        id: 'a',
        text: "Swim harder directly toward shore against the current",
        outcome: 'fatal',
        score: -80,
        explanation: "DEADLY MISTAKE: Rip currents move at 2-3 m/s (faster than Olympic swimmers). Fighting them exhausts you in minutes, leading to drowning. 80% of beach rescues are rip currents, mostly from people fighting the current. NEVER swim against a rip current.",
        consequences: "Rapid exhaustion, panic, drowning likely within 10 minutes"
      },
      {
        id: 'b',
        text: "Swim parallel to shore (left or right) until out of current, then swim in",
        outcome: 'optimal',
        score: 100,
        explanation: "CORRECT! Rip currents are narrow (10-30m wide) but pull straight out. Swimming parallel (along beach) for 50-100m exits the current. Then swim diagonally back. This is the #1 survival technique taught by lifeguards worldwide.",
        consequences: "Exit current in 2-3 minutes, safe return to shore, minimal energy use"
      },
      {
        id: 'c',
        text: "Float on back and let current take you out, conserve energy",
        outcome: 'good',
        score: 70,
        explanation: "ACCEPTABLE: Rip currents typically stop 50-100m offshore where they dissipate. Floating conserves energy and prevents drowning. However, being further from shore increases risk and rescue difficulty. Swimming parallel is faster and safer.",
        consequences: "Safe from exhaustion, but drift farther out, harder rescue, depends on current"
      },
      {
        id: 'd',
        text: "Wave arms and yell for lifeguard help while treading water",
        outcome: 'good',
        score: 65,
        explanation: "REASONABLE: Signaling for help is smart if you're not confident swimming. Treading water conserves more energy than swimming against current. However, relying solely on rescue means hoping help arrives before exhaustion. Better combined with parallel swimming.",
        consequences: "Help may arrive, but energy depletes while waiting, outcome uncertain"
      }
    ],
    expertTip: "Rip current survival: NEVER fight it. Swim parallel to shore. Rip currents are narrow channels - escape sideways, not head-on."
  },

  {
    id: 'hypothermia',
    title: 'Cold Water Hypothermia',
    category: 'medical',
    difficulty: 'expert',
    emoji: '🥶',
    situation: "Your kayak capsized in 8°C (46°F) water. You're wearing a life jacket but soaked. Swimming to shore is 100 meters. Air temp is 12°C with wind. You're already shivering violently. A rescue boat is coming but 20 minutes away.",
    context: {
      location: "Lake, early spring, northern climate",
      conditions: [
        "Water temp: 8°C (46°F)",
        "Air temp: 12°C + wind",
        "Distance to shore: 100m",
        "Time to rescue: 20 minutes"
      ],
      resources: [
        "Life jacket (on)",
        "Capsized kayak (floating)",
        "Wet clothing",
        "No dry gear"
      ],
      timeLimit: "Hypothermia progression: 10-30 minutes to unconsciousness"
    },
    choices: [
      {
        id: 'a',
        text: "Swim to shore immediately to get out of cold water",
        outcome: 'fatal',
        score: -90,
        explanation: "CRITICAL ERROR: Swimming in cold water increases heat loss by 35% due to movement circulating cold water around body. 100m swim in 8°C water = severe hypothermia or death. Movement also speeds cooling by pumping cold blood to your core. Classic drowning scenario.",
        consequences: "Unconsciousness before reaching shore, drowning highly likely, severe hypothermia"
      },
      {
        id: 'b',
        text: "Climb onto capsized kayak, assume HELP position (Heat Escape Lessening Position), wait for rescue",
        outcome: 'optimal',
        score: 100,
        explanation: "PERFECT SURVIVAL RESPONSE: Getting out of water is critical - air insulates better than water. HELP position (arms crossed, legs together, tucked) protects core heat zones: groin, armpits, neck. Staying still preserves energy and heat. 20 minutes is survivable in HELP position.",
        consequences: "Maximizes survival time to 50+ minutes, rescue arrives in time, hypothermia managed"
      },
      {
        id: 'c',
        text: "Tread water in place and stay calm to conserve energy",
        outcome: 'poor',
        score: 20,
        explanation: "INADEQUATE: While staying calm is good, treading water still circulates cold water around your body, accelerating heat loss. You remain fully immersed in 8°C water. Without movement you sink, with movement you cool faster. Worse than getting out of water.",
        consequences: "Moderate hypothermia in 15 minutes, severe in 25 minutes, may not last until rescue"
      },
      {
        id: 'd',
        text: "Remove wet clothes to reduce cooling effect",
        outcome: 'fatal',
        score: -100,
        explanation: "FATAL MISTAKE: Wet clothes provide insulation (trapped water layer warms slightly). Removing them exposes skin directly to 8°C water = 25x faster heat loss. You'd lose consciousness in 5-8 minutes. NEVER remove clothing in cold water unless exiting water immediately.",
        consequences: "Unconsciousness in under 10 minutes, death likely before rescue arrives"
      }
    ],
    expertTip: "Cold water survival: 1-10-1 rule: 1 min to control breathing, 10 min of meaningful movement, 1 hour before unconsciousness. GET OUT OF WATER if possible."
  }
];

// ==================== COMPONENT ====================

export default function BrainSharp() {
  const [gameState, setGameState] = useState<GameState>({
    currentScenario: null,
    selectedChoice: null,
    totalScore: 0,
    scenariosCompleted: 0,
    lives: 3,
    gameOver: false,
    showResult: false
  });

  const [availableScenarios, setAvailableScenarios] = useState<Scenario[]>([...SCENARIOS]);

  // Start new game
  const startNewGame = () => {
    const randomScenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
    setGameState({
      currentScenario: randomScenario,
      selectedChoice: null,
      totalScore: 0,
      scenariosCompleted: 0,
      lives: 3,
      gameOver: false,
      showResult: false
    });
  };

  // Load next scenario
  const loadNextScenario = () => {
    const remaining = availableScenarios.filter(s => s.id !== gameState.currentScenario?.id);
    if (remaining.length === 0) {
      // All scenarios completed - restart pool
      setAvailableScenarios([...SCENARIOS]);
      const randomScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
      setGameState(prev => ({
        ...prev,
        currentScenario: randomScenario,
        selectedChoice: null,
        showResult: false
      }));
    } else {
      const randomScenario = remaining[Math.floor(Math.random() * remaining.length)];
      setAvailableScenarios(remaining);
      setGameState(prev => ({
        ...prev,
        currentScenario: randomScenario,
        selectedChoice: null,
        showResult: false
      }));
    }
  };

  // Handle choice selection
  const handleChoice = (choice: Choice) => {
    setGameState(prev => ({
      ...prev,
      selectedChoice: choice,
      showResult: true
    }));
  };

  // Continue to next scenario
  const handleContinue = () => {
    const newScore = gameState.totalScore + (gameState.selectedChoice?.score || 0);
    const newLives = gameState.selectedChoice?.outcome === 'fatal' 
      ? gameState.lives - 1 
      : gameState.lives;
    
    if (newLives <= 0) {
      setGameState(prev => ({
        ...prev,
        totalScore: newScore,
        gameOver: true
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        totalScore: newScore,
        scenariosCompleted: prev.scenariosCompleted + 1,
        lives: newLives
      }));
      loadNextScenario();
    }
  };

  // Get outcome color
  const getOutcomeColor = (outcome: Outcome) => {
    switch (outcome) {
      case 'optimal': return '#10b981'; // green
      case 'good': return '#3b82f6'; // blue
      case 'poor': return '#f59e0b'; // orange
      case 'fatal': return '#ef4444'; // red
    }
  };

  // Get outcome label
  const getOutcomeLabel = (outcome: Outcome) => {
    switch (outcome) {
      case 'optimal': return '✓ OPTIMAL CHOICE';
      case 'good': return '~ Good Choice';
      case 'poor': return '⚠ Poor Choice';
      case 'fatal': return '✗ FATAL MISTAKE';
    }
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'expert': return '#ef4444';
    }
  };

  // Initial screen
  if (!gameState.currentScenario) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          maxWidth: '600px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '48px',
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            🧠 Brain Sharp
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#94a3b8',
            marginBottom: '40px'
          }}>
            Critical Thinking & Survival Decisions
          </p>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>How to Play:</h2>
            <ul style={{ color: '#cbd5e1', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>Face realistic emergency scenarios</li>
              <li>Make critical decisions under pressure</li>
              <li>Learn from expert feedback</li>
              <li>Build survival intelligence</li>
              <li>You have 3 lives - fatal mistakes cost a life</li>
            </ul>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginBottom: '30px',
            fontSize: '14px'
          }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>🏔️</div>
              <div style={{ color: '#10b981' }}>Nature</div>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>🌊</div>
              <div style={{ color: '#ef4444' }}>Disasters</div>
            </div>
            <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>🐻</div>
              <div style={{ color: '#a855f7' }}>Wildlife</div>
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '15px', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>🏥</div>
              <div style={{ color: '#3b82f6' }}>Medical</div>
            </div>
          </div>

          <button
            onClick={startNewGame}
            style={{
              width: '100%',
              padding: '18px',
              fontSize: '20px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  // Game Over screen
  if (gameState.gameOver) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          maxWidth: '500px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>💀 Game Over</h1>
          <p style={{ fontSize: '18px', color: '#cbd5e1', marginBottom: '30px' }}>
            You ran out of lives. Survival requires better decision-making!
          </p>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '10px' }}>Final Score</div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981' }}>
              {gameState.totalScore}
            </div>
            <div style={{ fontSize: '16px', color: '#94a3b8', marginTop: '15px' }}>
              Scenarios Completed: {gameState.scenariosCompleted}
            </div>
          </div>

          <button
            onClick={() => {
              setAvailableScenarios([...SCENARIOS]);
              startNewGame();
            }}
            style={{
              width: '100%',
              padding: '18px',
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const scenario = gameState.currentScenario;

  // Result screen
  if (gameState.showResult && gameState.selectedChoice) {
    const choice = gameState.selectedChoice;
    
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          color: 'white'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <h1 style={{ fontSize: '24px', margin: 0 }}>🧠 Brain Sharp</h1>
            </div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                Score: <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                  {gameState.totalScore + choice.score}
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                Lives: <span style={{ color: choice.outcome === 'fatal' ? '#ef4444' : '#10b981' }}>
                  {'❤️'.repeat(choice.outcome === 'fatal' ? gameState.lives - 1 : gameState.lives)}
                </span>
              </div>
            </div>
          </div>

          {/* Outcome Banner */}
          <div style={{
            background: getOutcomeColor(choice.outcome),
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
              {getOutcomeLabel(choice.outcome)}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {choice.score > 0 ? '+' : ''}{choice.score} points
            </div>
          </div>

          {/* Your Choice */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '10px' }}>YOUR DECISION:</div>
            <div style={{ fontSize: '18px', lineHeight: '1.6' }}>{choice.text}</div>
          </div>

          {/* Expert Analysis */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '15px' }}>
              📋 EXPERT ANALYSIS:
            </div>
            <div style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '15px' }}>
              {choice.explanation}
            </div>
            {choice.consequences && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#cbd5e1',
                marginTop: '15px'
              }}>
                <strong>Consequences:</strong> {choice.consequences}
              </div>
            )}
          </div>

          {/* Expert Tip */}
          {scenario.expertTip && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <div style={{ fontSize: '14px', color: '#10b981', marginBottom: '10px' }}>
                💡 EXPERT TIP:
              </div>
              <div style={{ fontSize: '15px', lineHeight: '1.6' }}>
                {scenario.expertTip}
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            style={{
              width: '100%',
              padding: '18px',
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {gameState.lives - (choice.outcome === 'fatal' ? 1 : 0) <= 0 
              ? 'See Final Score' 
              : 'Next Scenario →'}
          </button>
        </div>
      </div>
    );
  }

  // Main scenario screen
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        color: 'white'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', margin: 0 }}>🧠 Brain Sharp</h1>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>
              Score: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{gameState.totalScore}</span>
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>
              Completed: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{gameState.scenariosCompleted}</span>
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8' }}>
              Lives: <span style={{ color: '#ef4444' }}>{'❤️'.repeat(gameState.lives)}</span>
            </div>
          </div>
        </div>

        {/* Scenario Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '32px' }}>{scenario.emoji}</span>
              <h2 style={{ fontSize: '24px', margin: 0 }}>{scenario.title}</h2>
            </div>
            <div style={{
              background: getDifficultyColor(scenario.difficulty),
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {scenario.difficulty}
            </div>
          </div>
          
          <p style={{ fontSize: '16px', lineHeight: '1.8', margin: 0 }}>
            {scenario.situation}
          </p>
        </div>

        {/* Context Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          {/* Location */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '15px'
          }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>📍 LOCATION</div>
            <div style={{ fontSize: '14px' }}>{scenario.context.location}</div>
          </div>

          {/* Time Limit */}
          {scenario.context.timeLimit && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '15px'
            }}>
              <div style={{ fontSize: '12px', color: '#ef4444', marginBottom: '8px' }}>⏱️ TIME PRESSURE</div>
              <div style={{ fontSize: '14px' }}>{scenario.context.timeLimit}</div>
            </div>
          )}
        </div>

        {/* Conditions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>⚠️ CONDITIONS:</div>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '15px', lineHeight: '1.8' }}>
            {scenario.context.conditions.map((condition, i) => (
              <li key={i}>{condition}</li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>🎒 AVAILABLE RESOURCES:</div>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '15px', lineHeight: '1.8' }}>
            {scenario.context.resources.map((resource, i) => (
              <li key={i}>{resource}</li>
            ))}
          </ul>
        </div>

        {/* Choices */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            What do you do?
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {scenario.choices.map((choice, index) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white',
                  fontSize: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  lineHeight: '1.6'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = '#a855f7';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontWeight: 'bold', color: '#a855f7', marginRight: '10px' }}>
                  {String.fromCharCode(65 + index)}.
                </span>
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}