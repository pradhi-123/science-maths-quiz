// Seed Questions database split across Round 1, Round 2, and Round 3.
// Seeding exactly 6 questions per round with individual high-quality video loops and card colorways.
const DEFAULT_QUESTIONS = [
  // --- ROUND 1: REASONING ROUND (6 questions) ---
  {
    id: "r1-q1",
    video: "/images/untitled_design/ppt/media/VAHBI3fvauM.mp4",
    round: 1,
    text: "When exposed to air, why do most cookies turn soft and most cakes turn hard?",
    answer: "Cakes generally have a higher water content compared to cookies. When cakes are exposed to air, moisture from the cakes start to evaporate, making them hard. Cookies have a lower water content, so they absorb moisture from the atmosphere, making them soft.",
    timeLimit: 60,
    keywords: "cookies, cakes, stale, moisture",
    image: "/images/q1.png",
    cardColor: "#ff0080",
    cardGradient: "linear-gradient(135deg, rgba(255, 0, 128, 0.45) 0%, rgba(255, 170, 0, 0.45) 100%)"
  },
  {
    id: "r1-q2",
    video: "/images/untitled_design/ppt/media/VAGGdp__oEU.mp4",
    round: 1,
    text: "Why do ice cubes float in your glass of water when almost all other solid objects sink in their own liquids?",
    answer: "When water freezes into ice, its molecules lock into a rigid, spacious tetrahedral structure. This makes ice about 9% less dense than liquid water, allowing it to float.",
    timeLimit: 60,
    keywords: "ice, float, water, structure",
    image: "/images/q2.png",
    cardColor: "#00ffd1",
    cardGradient: "linear-gradient(135deg, rgba(0, 255, 209, 0.45) 0%, rgba(0, 128, 255, 0.45) 100%)"
  },
  {
    id: "r1-q3",
    video: "/images/untitled_design/ppt/media/VAGOQE_gJrE.mp4",
    round: 1,
    text: "When you drop a slinky it will collapse onto the last ring and then it all  falls at the same time instead of falling as one unit.",
    answer: "The slinky contracts at the same rate as it is falling.",
    timeLimit: 60,
    keywords: "slinky, spring, gravity",
    image: "/images/q3.png",
    cardColor: "#bd00ff",
    cardGradient: "linear-gradient(135deg, rgba(189, 0, 255, 0.45) 0%, rgba(255, 0, 128, 0.45) 100%)"
  },
  {
    id: "r1-q4",
    video: "/images/untitled_design/ppt/media/VAGOQJxFNJ4.mp4",
    round: 1,
    text: "Why do silver ornaments become black over time?",
    answer: "Silver reacts with hydrogen sulphide in air to form black silver sulphide.",
    timeLimit: 60,
    keywords: "silver, ornaments, black",
    image: "/images/q4.png",
    cardColor: "#ffaa00",
    cardGradient: "linear-gradient(135deg, rgba(255, 170, 0, 0.45) 0%, rgba(255, 85, 0, 0.45) 100%)"
  },
  {
    id: "r1-q5",
    bg: "url('/images/sciencequiz2022_extract/ppt/media/image73.gif') no-repeat center center / 100% 100%",
    round: 1,
    text: "Why is iodine solution used on wounds?",
    answer: "It acts as an antiseptic by killing microorganisms.",
    timeLimit: 60,
    keywords: "iodine, wound, antiseptic",
    image: "/images/q5.png",
    cardColor: "#00d2ff",
    cardGradient: "linear-gradient(135deg, rgba(0, 210, 255, 0.45) 0%, rgba(189, 0, 255, 0.45) 100%)"
  },
  {
    id: "r1-q6",
    video: "/images/untitled_design/ppt/media/VAG5zwPs8_U.mp4",
    round: 1,
    text: "Why do cool drink bottles fizz when opened?",
    answer: "Carbon dioxide escapes because the pressure suddenly decreases.",
    timeLimit: 60,
    keywords: "soda, fizz, pressure",
    image: "/images/q6.png",
    cardColor: "#ff0055",
    cardGradient: "linear-gradient(135deg, rgba(255, 0, 85, 0.45) 0%, rgba(255, 170, 0, 0.45) 100%)"
  },

  // --- ROUND 2: THERMODYNAMIC ENTROPY (6 questions) ---
  {
    id: "r2-q1",
    bg: "url('/images/sciencequiz2022_extract/ppt/media/image13.gif') no-repeat center center / 100% 100%",
    round: 3,
    text: "Name the gas that was leaked in a factory near Chennai that took 20 lives recently?",
    answer: "Ammonia Gas (coolant system leak at seafood factory)",
    timeLimit: 60,
    keywords: "chennai, gas, factory, ammonia",
    image: "/images/image1.jpeg",
    answerImage: "/images/image2.jpeg",
    cardColor: "#00ffd1",
    cardGradient: "linear-gradient(135deg, rgba(0, 255, 209, 0.45) 0%, rgba(0, 128, 255, 0.45) 100%)"
  },
  {
    id: "r2-q2",
    bg: "url('/images/sciencequiz2022_extract/ppt/media/image12.jpeg') no-repeat center center / 100% 100%",
    round: 3,
    text: "Name the chemical secreted in the brain that kindles the interest in human to learn more and also focus on new things.",
    answer: "Dopamine (associated with pleasure, focus, and drive)",
    timeLimit: 60,
    keywords: "chemical, brain, interest, dopamine",
    image: "/images/image3.jpeg",
    answerImage: "/images/image4.jpeg",
    cardColor: "#ff0080",
    cardGradient: "linear-gradient(135deg, rgba(255, 0, 128, 0.45) 0%, rgba(255, 170, 0, 0.45) 100%)"
  },
  {
    id: "r2-q3",
    bg: "url('/images/sciencequiz2022_extract/ppt/media/image11.gif') no-repeat center center / 100% 100%",
    round: 3,
    text: "What is the scientific reason behind designing the javelin with the sharp edge?",
    answer: "To minimize air resistance (aerodynamic streamlined design)",
    timeLimit: 60,
    keywords: "scientific, javelin, sharp, air resistance",
    image: "/images/image5.jpeg",
    cardColor: "#bd00ff",
    cardGradient: "linear-gradient(135deg, rgba(189, 0, 255, 0.45) 0%, rgba(255, 0, 128, 0.45) 100%)"
  },
  {
    id: "r2-q4",
    bg: "url('/images/sciencequiz2022_extract/ppt/media/image17.gif') no-repeat center center / 100% 100%",
    round: 3,
    text: "Name the chemical compound that is added along with petrol gas (LPG) to detect leakage?",
    answer: "Ethyl Mercaptan (Ethanethiol - has a strong odour)",
    timeLimit: 60,
    keywords: "chemical, petrol, lpg, mercaptan, detect",
    image: "/images/image6.jpeg",
    answerImage: "/images/image7.jpeg",
    cardColor: "#ffaa00",
    cardGradient: "linear-gradient(135deg, rgba(255, 170, 0, 0.45) 0%, rgba(255, 85, 0, 0.45) 100%)"
  },
  {
    id: "r2-q5",
    bg: "url('/images/sciencequiz2022_extract/ppt/media/image67.gif') no-repeat center center / 100% 100%",
    round: 3,
    text: "QR codes are based on which branch of mathematics?",
    answer: "Matrix Theory / Linear Algebra (2D grid systems)",
    timeLimit: 60,
    keywords: "qr, codes, branch, mathematics, matrix",
    image: "/images/image8.png",
    answerImage: "/images/image9.jpeg",
    cardColor: "#00d2ff",
    cardGradient: "linear-gradient(135deg, rgba(0, 210, 255, 0.45) 0%, rgba(189, 0, 255, 0.45) 100%)"
  },
  {
    id: "r2-q6",
    bg: "url('/images/sciencequiz2022_extract/ppt/media/image64.gif') no-repeat center center / 100% 100%",
    round: 3,
    text: "Without using a calculator, what is A² (where A = 111,111,111)?",
    answer: "12,345,678,987,654,321 (consecutive digit square pattern)",
    timeLimit: 60,
    keywords: "calculator, square, consecutive, math",
    image: "/images/image10.jpeg",
    answerImage: "/images/image12.png",
    cardColor: "#ff0055",
    cardGradient: "linear-gradient(135deg, rgba(255, 0, 85, 0.45) 0%, rgba(255, 170, 0, 0.45) 100%)"
  },

  // --- ROUND 3: GLACIAL DECIPHERING (6 questions) ---
  {
    id: "r3-q1",
    video: "/images/scientofabio_extract/ppt/media/VAG6sBH98ZY.mp4",
    round: 4,
    text: "Name the type of reaction?",
    captions: ["", "Ant bite", ""],
    answer: "Neutralization Reaction (Formic acid neutralized by mild alkaline bases)",
    timeLimit: 60,
    keywords: "ant, bite, type, reaction, neutralization",
    images: ["/images/image13.jpeg", "/images/image14.jpeg", "/images/image15.jpeg"],
    cardColor: "#00ffd1",
    cardGradient: "linear-gradient(135deg, rgba(0, 255, 209, 0.45) 0%, rgba(0, 128, 255, 0.45) 100%)"
  },
  {
    id: "r3-q2",
    video: "/images/scientofabio_extract/ppt/media/VAG9f9GjA-U.mp4",
    round: 4,
    text: "Name the branch of Mathematics representing these coordinate plots?",
    answer: "Coordinate Geometry (Analytical Geometry)",
    timeLimit: 60,
    keywords: "branch, mathematics, coordinate, geometry",
    images: ["/images/image16.png", "/images/image17.jpeg", "/images/image18.jpeg"],
    cardColor: "#ff0080",
    cardGradient: "linear-gradient(135deg, rgba(255, 0, 128, 0.45) 0%, rgba(255, 170, 0, 0.45) 100%)"
  },
  {
    id: "r3-q3",
    video: "/images/scientofabio_extract/ppt/media/VAG5zwPs8_U.mp4",
    round: 4,
    text: "Name the drug discovered by Alexander Fleming?",
    answer: "Penicillin (extracted from Penicillium mould)",
    timeLimit: 60,
    keywords: "antibiotic, penicillin, fleming, medicine",
    images: ["/images/image19.jpeg", "/images/image20.jpeg", "/images/image21.png"],
    cardColor: "#bd00ff",
    cardGradient: "linear-gradient(135deg, rgba(189, 0, 255, 0.45) 0%, rgba(255, 0, 128, 0.45) 100%)"
  },
  {
    id: "r3-q4",
    video: "/images/scientofabio_extract/ppt/media/VAG1haZikIU.mp4",
    round: 4,
    text: "Who is this physicist known for electricity experiments?",
    answer: "Benjamin Franklin",
    timeLimit: 60,
    keywords: "physicist, benjamin, franklin, electricity",
    images: ["/images/image22.jpeg", "/images/image23.png", "/images/image24.png", "/images/image25.png"], // reuse first loops
    cardColor: "#ffaa00",
    cardGradient: "linear-gradient(135deg, rgba(255, 170, 0, 0.45) 0%, rgba(255, 85, 0, 0.45) 100%)"
  },
  {
    id: "r3-q5",
    video: "/images/scientofabio_extract/ppt/media/VAGZ2h7bpE8.mp4",
    round: 4,
    text: "C is ___________?",
    answer: "Specific Heat Capacity (of water)",
    timeLimit: 60,
    keywords: "formula, temperature, capacity, specific heat",
    images: ["/images/image26.jpeg", "/images/image27.jpeg", "/images/image28.PNG"], // reuse
    cardColor: "#00d2ff",
    cardGradient: "linear-gradient(135deg, rgba(0, 210, 255, 0.45) 0%, rgba(189, 0, 255, 0.45) 100%)"
  },

  // --- ROUND 2: ALGEBRAIC MATRICES (6 questions) ---
  {
    id: "r4-q1",
    video: "/images/untitled_design/ppt/media/VAGvTJXmSnQ.mp4",
    round: 2,
    text: "Find the value of: 999999² - (999998 × 1000000)",
    answer: "Let a = 999999\nThen 999998 = a - 1, 1000000 = a + 1\nSo, a² - (a - 1)(a + 1)\nUsing the identity (a-1)(a+1) = a² - 1\n= a² - (a² - 1)\n= 1",
    timeLimit: 60,
    keywords: "math, algebra, equation, square",
    image: "",
    cardColor: "#00ff88",
    cardGradient: "linear-gradient(135deg, rgba(0, 255, 136, 0.45) 0%, rgba(0, 136, 255, 0.45) 100%)"
  },
  {
    id: "r4-q2",
    video: "/images/untitled_design/ppt/media/VAGiJZDHYVk.mp4",
    round: 2,
    text: "Find the value of: √(299² + 299 + 300)",
    answer: "Let a = 299\nThen √(a² + a + a + 1)\n= √(a² + 2a + 1)\n= √(a + 1)²\n= a + 1\n= 299 + 1 = 300",
    timeLimit: 60,
    keywords: "math, algebra, root, square",
    image: "",
    cardColor: "#ff0080",
    cardGradient: "linear-gradient(135deg, rgba(255, 0, 128, 0.45) 0%, rgba(255, 170, 0, 0.45) 100%)"
  },
  {
    id: "r4-q3",
    video: "/images/untitled_design/ppt/media/VAG-98XlJp8.mp4",
    round: 2,
    text: "Find the value of: √(999² + 1998 + 1)",
    answer: "Let a = 999\nThen √(a² + 2a + 1)\n= √(a + 1)²\n= a + 1\n= 999 + 1 = 1000",
    timeLimit: 60,
    keywords: "math, algebra, root, equation",
    image: "",
    cardColor: "#00ffd1",
    cardGradient: "linear-gradient(135deg, rgba(0, 255, 209, 0.45) 0%, rgba(0, 128, 255, 0.45) 100%)"
  },
  {
    id: "r4-q4",
    video: "/images/untitled_design/ppt/media/VAG-3NkZtuQ.mp4",
    round: 2,
    text: "Choose the right answer: 4¹⁰⁰ + 4¹⁰⁰.\n\n(a) 2²⁰⁰ \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 (b) 2²⁰¹ \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 (c) 4²⁰⁰ \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 (d) 2¹⁰⁰",
    answer: "4¹⁰⁰ + 4¹⁰⁰\n= (2²)¹⁰⁰ + (2²)¹⁰⁰\n= 2²⁰⁰ + 2²⁰⁰\n= 2 × 2²⁰⁰\n= 2²⁰¹",
    timeLimit: 60,
    keywords: "math, algebra, exponents",
    image: "",
    cardColor: "#ffaa00",
    cardGradient: "linear-gradient(135deg, rgba(255, 170, 0, 0.45) 0%, rgba(255, 85, 0, 0.45) 100%)"
  },
  {
    id: "r4-q5",
    video: "/images/untitled_design/ppt/media/VAF_cYsWN1Y.mp4",
    round: 2,
    text: "If m³ = 27, and n³ = 36. Find m + n? (Note: 9 is not the answer)",
    answer: "m³ = 27, n³ = -36\nAnswer: -3",
    timeLimit: 60,
    keywords: "math, algebra, exponents, cube",
    image: "",
    cardColor: "#00d2ff",
    cardGradient: "linear-gradient(135deg, rgba(0, 210, 255, 0.45) 0%, rgba(189, 0, 255, 0.45) 100%)"
  },
  {
    id: "r4-q6",
    video: "/images/untitled_design/ppt/media/VAD-V13dHbY.mp4",
    round: 2,
    text: "If y⁸ = (y - 1)⁸. Find y.",
    answer: "Since the powers are even, y = y - 1 => 0 = -1 (Not possible)\nNow consider: y = -(y - 1)\ny = -y + 1\n2y = 1\ny = 1/2",
    timeLimit: 60,
    keywords: "math, algebra, exponents, equation",
    image: "",
    cardColor: "#00ff88",
    cardGradient: "linear-gradient(135deg, rgba(0, 255, 136, 0.45) 0%, rgba(0, 136, 255, 0.45) 100%)"
  },
  
  // --- ROUND 5: EXPERIMENTAL ROUND (4 questions) ---
  {
    id: "r5-q1",
    video: "/images/untitled_design/ppt/media/VAD-V13dHbY.mp4",
    round: 5,
    text: "Activity 1: You are provided with 6-8 books, an A-4 sheet and a rectangular object. How will you balance a given object on an A-4 sheet placed between minimum 3 books each? Name the working principle?",
    answer: "Centre of gravity",
    timeLimit: 120,
    keywords: "balance, books, principle, gravity",
    image: "",
    cardColor: "#00ffd1",
    cardGradient: "linear-gradient(135deg, rgba(0, 255, 209, 0.45) 0%, rgba(0, 128, 255, 0.45) 100%)"
  },
  {
    id: "r5-q2",
    video: "/images/untitled_design/ppt/media/VAElu_htxkY.mp4",
    round: 5,
    text: "Activity 2: You are given 6-8 textbooks, placed on each other. Now you need to push the textbooks with your little finger? Hint: For additional support, you can use the materials given. Name the phenomenon?",
    answer: "Rolling Friction",
    timeLimit: 120,
    keywords: "push, textbooks, finger, phenomenon, friction",
    image: "",
    cardColor: "#ff0080",
    cardGradient: "linear-gradient(135deg, rgba(255, 0, 128, 0.45) 0%, rgba(255, 170, 0, 0.45) 100%)"
  },
  {
    id: "r5-q3",
    video: "/images/untitled_design/ppt/media/VAF_cYsWN1Y.mp4",
    round: 5,
    text: "Activity 3: You are given INR 500 along with a pen. You must balance the pen on the currency note, then remove the note, without the pen fall. Name the phenomenon?",
    answer: "Kinetic Friction",
    timeLimit: 120,
    keywords: "balance, pen, remove, note, friction",
    image: "",
    cardColor: "#ffaa00",
    cardGradient: "linear-gradient(135deg, rgba(255, 170, 0, 0.45) 0%, rgba(255, 85, 0, 0.45) 100%)"
  },
  {
    id: "r5-q4",
    video: "/images/untitled_design/ppt/media/VAG-3NkZtuQ.mp4",
    round: 5,
    text: "Activity 4 (Surprise Round In case of Tie): The coin is vertically balanced one after another in the presence of strong magnetic field? What is the principle behind it?",
    answer: "Properties of Para & Ferro magnetic substance",
    timeLimit: 120,
    keywords: "coin, balanced, magnetic, principle",
    image: "",
    cardColor: "#bd00ff",
    cardGradient: "linear-gradient(135deg, rgba(189, 0, 255, 0.45) 0%, rgba(255, 0, 128, 0.45) 100%)"
  }
];

export function getSavedQuestions() {
  const data = localStorage.getItem('school_quiz_questions_v24');
  let savedList = [];
  if (data) {
    try {
      savedList = JSON.parse(data);
    } catch (e) {
      // Ignore
    }
  }

  // Robust Merge-On-Load: preserves user edits while loading default assets/videos
  if (Array.isArray(savedList) && savedList.length > 0) {
    const merged = DEFAULT_QUESTIONS.map(defaultQ => {
      const userQ = savedList.find(sq => sq.id === defaultQ.id);
      if (userQ) {
        return {
          ...defaultQ,
          text: userQ.text || defaultQ.text,
          answer: userQ.answer || defaultQ.answer,
          timeLimit: defaultQ.round === 5 ? 120 : 60,
          keywords: userQ.keywords || defaultQ.keywords,
          image: userQ.image || defaultQ.image
        };
      }
      return defaultQ;
    });
    localStorage.setItem('school_quiz_questions_v24', JSON.stringify(merged));
    return merged;
  }

  // Initialize with seed
  localStorage.setItem('school_quiz_questions_v24', JSON.stringify(DEFAULT_QUESTIONS));
  return DEFAULT_QUESTIONS;
}

export function saveQuestions(list) {
  localStorage.setItem('school_quiz_questions_v24', JSON.stringify(list));
}
export { DEFAULT_QUESTIONS };
