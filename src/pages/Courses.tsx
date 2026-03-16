import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Puzzle, Check, ChevronRight, Award, Clock as ClockIcon } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import RevealImage from "@/components/RevealImage";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const chessPieces = ["♟", "♞", "♝", "♜", "♛"];
const chessPieceColors = ["#2B7DD4", "#2B7DD4", "#2B7DD4", "#2B7DD4", "#F5C518"];

const chessLevels = [
  { level: "Level 1", name: "Beginner Nest", badge: "Beginner Nest Badge", age: "Ages 5 to 7, zero experience required", learn: "Piece movement and board orientation for all 6 piece types, basic checkmates including back-rank mate and smothered mate, pattern recognition games designed for young attention spans, story-based lessons where each piece has a character and mission, fun tactical puzzles presented as adventures.", format: "Group 4 to 6 students, 45 minutes per class, weekly schedule", tools: "Zoom for live class, Lichess beginner puzzle sets", homework: "15 minutes daily puzzle practice, designed to feel like playing a game", milestone: "Completing an independent checkmate, solving basic tactical puzzles at beginner level", time: "2 to 4 months of consistent practice" },
  { level: "Level 2", name: "Rising Pawns", badge: "Rising Pawn Badge", age: "Ages 7 to 10, basics mastered and ready for structure", learn: "Core tactical motifs including forks, pins, and skewers; opening principles covering center control, piece development, and king safety; basic endgame techniques; first internal tournament exposure.", format: "Group 4 to 6 students, 45 to 60 minutes, weekly", tools: "Zoom and Lichess tactical trainer", homework: "20 minutes daily — mixed puzzle set plus one practice game per day", milestone: "", time: "3 to 6 months" },
  { level: "Level 3", name: "Strategic Knights", badge: "Strategic Knight Badge", age: "Ages 9 to 12, tactical basics solid", learn: "Positional ideas including weak squares, pawn structure, and piece activity; opening repertoire building; middlegame planning; introduction to ChessBase for game analysis; game annotation and self-review skills.", format: "Group 4 to 6, 60 minutes, weekly", tools: "Zoom, Lichess, ChessBase introduction", homework: "25 minutes daily — puzzle sets plus annotated game analysis", milestone: "", time: "4 to 8 months" },
  { level: "Level 4", name: "Tactical Bishops", badge: "Tactical Bishop Badge", age: "Ages 11 and above, strong positional and tactical foundation", learn: "Advanced tactical combinations including deflection, interference, and zugzwang; comprehensive endgame theory; deep ChessBase analysis; tournament preparation including clock management.", format: "Group plus optional private sessions, 60 minutes per class", tools: "Zoom, Lichess, ChessBase full professional suite", homework: "30 minutes daily — complex tactical puzzles plus full annotated game analysis", milestone: "", time: "" },
  { level: "Level 5", name: "Master Rooks & Queens", badge: "Master Rook Badge & FIDE Queens Path Badge", age: "Serious competitors wanting rated play", learn: "Complete opening repertoire for both colors; advanced endgame mastery; psychological preparation and mental toughness; full clock management; FIDE tournament entry guidance; study of grandmaster games.", format: "Primarily 1-on-1 private sessions, 60 to 90 minutes", tools: "", homework: "", milestone: "", time: "" },
];

const cubeLevels = [
  { name: "Cube Basics", age: "Ages 6 and up, no experience needed", learn: "Understanding cube notation and move language, the Layer-by-Layer solving method.", builds: "Spatial reasoning, sequential memory, algorithmic thinking, patience and persistence", format: "Group 4 to 6 students, 45 minutes per class, weekly", outcome: "Complete an independent 3x3 solve within the first month" },
  { name: "Speedcubing Challenge", age: "Students who can already solve the cube", learn: "Full CFOP advanced solving method, efficient finger tricks, lookahead skills, personal best tracking, competition preparation.", builds: "", format: "Group sessions plus monthly timed challenge events", outcome: "Sub-1 minute first, then sub-30 seconds for dedicated students" },
];

const classFeatures = [
  "Live on Zoom — every class is live and instructor-led with interactive demo boards.",
  "Lichess practice platform — daily puzzle assignments and practice games.",
  "ChessBase professional analysis — used from Intermediate L2 onwards.",
  "Recorded class replays — every session is recorded and shared.",
  "Homework assignments — structured 20 to 30 minutes daily.",
  "Monthly progress reports — detailed PDF reports sent to parents.",
  "Weekly internal tournaments — built into every plan at no extra cost.",
  "Achievement milestone badges — awarded at each level completion.",
  "Parent updates — monthly coach update via email or WhatsApp.",
];

const Courses = () => {
  const [tab, setTab] = useState<"chess" | "cube">("chess");

  return (
    <div>
      <section className="relative pt-[75px]">
        <div className="container mx-auto px-4 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="font-display text-[34px] md:text-5xl lg:text-[64px] font-black text-navy leading-[1.15] mb-6" style={{ letterSpacing: "0.01em" }}>
              From First Move to Champion — A Path for Every Child
            </h1>
            <p className="font-body text-lg text-secondary leading-relaxed">
              Two structured programs. Seven progressive levels. One goal: a sharper, more confident child.
            </p>
          </motion.div>
        </div>
      </section>

      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex gap-4 mb-12 justify-center">
            <button
              onClick={() => setTab("chess")}
              className={`px-6 py-3 font-body font-semibold text-sm rounded-lg transition-all ${
                tab === "chess" ? "bg-sky text-white" : "cta-secondary"
              }`}
              style={tab === "chess" ? { background: "#2B7DD4" } : {}}
            >
              <Trophy size={16} className="inline mr-2" /> Chess Program
            </button>
            <button
              onClick={() => setTab("cube")}
              className={`px-6 py-3 font-body font-semibold text-sm rounded-lg transition-all ${
                tab === "cube" ? "bg-sky text-white" : "cta-secondary"
              }`}
              style={tab === "cube" ? { background: "#2B7DD4" } : {}}
            >
              <Puzzle size={16} className="inline mr-2" /> Rubik's Cube
            </button>
          </div>

          {tab === "chess" && (
            <div className="space-y-12">
              {chessLevels.map((level, i) => (
                <motion.div
                  key={level.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
                >
                  <div className={`bg-card p-8 rounded-xl card-shadow card-hover border border-sky-border ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="eyebrow-left">{level.level}</span>
                    </div>
                    <h3 className="font-display text-2xl lg:text-3xl font-bold text-navy mb-2">{level.name}</h3>
                    <p className="font-body text-sm mb-4" style={{ color: "#2B7DD4" }}>{level.age}</p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">What They Learn</h4>
                        <p className="font-body text-sm text-secondary leading-relaxed">{level.learn}</p>
                      </div>
                      <div>
                        <h4 className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Format</h4>
                        <p className="font-body text-sm text-secondary">{level.format}</p>
                      </div>
                      {level.tools && <div><h4 className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tools</h4><p className="font-body text-sm text-secondary">{level.tools}</p></div>}
                      {level.homework && <div><h4 className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Homework</h4><p className="font-body text-sm text-secondary">{level.homework}</p></div>}
                      {level.milestone && <div><h4 className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Milestone</h4><p className="font-body text-sm text-secondary">{level.milestone}</p></div>}
                      {level.time && <div><h4 className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Expected Time</h4><p className="font-body text-sm text-secondary">{level.time}</p></div>}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Award size={16} style={{ color: "#2B7DD4" }} />
                      <span className="font-body text-xs" style={{ color: "#2B7DD4" }}>{level.badge}</span>
                    </div>
                  </div>
                  <div className={`hidden lg:flex items-center justify-center ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="w-48 h-48 rounded-xl overflow-hidden border border-sky-border">
                      {i < 3 ? (
                        <RevealImage
                          src={[
                            "/images/course-beginner.jpg",
                            "/images/course-intermediate.jpg",
                            "/images/course-advanced.jpg",
                          ][i]}
                          alt={`${level.name} chess course thumbnail`}
                          imageClassName="h-full"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                          <span className="text-7xl" style={{ color: chessPieceColors[i] }}>{chessPieces[i]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {tab === "cube" && (
            <div className="space-y-8">
              {cubeLevels.map((level, i) => (
                <motion.div key={level.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card p-8 rounded-xl card-shadow card-hover border border-sky-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                      {i === 0 ? <Puzzle size={28} style={{ color: "#2B7DD4" }} /> : <ClockIcon size={28} style={{ color: "#2B7DD4" }} />}
                    </div>
                    <h3 className="font-display text-2xl lg:text-3xl font-bold text-navy">{level.name}</h3>
                  </div>
                  <p className="font-body text-sm mb-4" style={{ color: "#2B7DD4" }}>{level.age}</p>
                  <div className="space-y-4">
                    <div><h4 className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">What They Learn</h4><p className="font-body text-sm text-secondary leading-relaxed">{level.learn}</p></div>
                    {level.builds && <div><h4 className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Skills Built</h4><p className="font-body text-sm text-secondary">{level.builds}</p></div>}
                    <div><h4 className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Format</h4><p className="font-body text-sm text-secondary">{level.format}</p></div>
                    <div><h4 className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Expected Outcome</h4><p className="font-body text-sm text-secondary">{level.outcome}</p></div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">What Every Student Gets</span>
            <h2 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-navy">Class Features</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {classFeatures.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex gap-3 items-start p-4 bg-card rounded-lg border border-sky-border card-hover">
                <Check size={18} className="shrink-0 mt-0.5" style={{ color: "#2B7DD4" }} />
                <p className="font-body text-sm text-secondary leading-relaxed">{feature}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">At a Glance</span>
            <h2 className="font-display text-[28px] md:text-4xl font-bold text-navy">Level Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] font-body text-sm">
              <thead>
                <tr className="border-b border-sky-border">
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "#2B7DD4" }}>Feature</th>
                  <th className="text-center py-3 px-2 font-semibold text-xs" style={{ color: "#2B7DD4" }}>Beginner Nest</th>
                  <th className="text-center py-3 px-2 font-semibold text-xs" style={{ color: "#2B7DD4" }}>Rising Pawns</th>
                  <th className="text-center py-3 px-2 font-semibold text-xs" style={{ color: "#2B7DD4" }}>Strategic Knights</th>
                  <th className="text-center py-3 px-2 font-semibold text-xs" style={{ color: "#2B7DD4" }}>Tactical Bishops</th>
                  <th className="text-center py-3 px-2 font-semibold text-xs" style={{ color: "#2B7DD4" }}>Master R&Q</th>
                  <th className="text-center py-3 px-2 font-semibold text-xs" style={{ color: "#2B7DD4" }}>Cube Basics</th>
                  <th className="text-center py-3 px-2 font-semibold text-xs" style={{ color: "#2B7DD4" }}>Speedcubing</th>
                </tr>
              </thead>
              <tbody className="text-secondary">
                {[
                  { feature: "Age", vals: ["5–7", "7–10", "9–12", "11+", "All", "6+", "Solvers"] },
                  { feature: "Duration", vals: ["45 min", "45–60", "60 min", "60 min", "60–90", "45 min", "Varies"] },
                  { feature: "Group Size", vals: ["4–6", "4–6", "4–6", "Group+Pvt", "1-on-1", "4–6", "Group"] },
                  { feature: "Zoom", vals: ["✓", "✓", "✓", "✓", "✓", "✓", "✓"] },
                  { feature: "Lichess", vals: ["✓", "✓", "✓", "✓", "✓", "—", "—"] },
                  { feature: "ChessBase", vals: ["—", "—", "✓", "✓", "✓", "—", "—"] },
                  { feature: "Daily HW", vals: ["15 min", "20 min", "25 min", "30 min", "Yes", "Yes", "Yes"] },
                  { feature: "FIDE Prep", vals: ["—", "—", "—", "✓", "✓", "—", "WCA"] },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-sky-border/30">
                    <td className="py-3 px-4 font-medium text-navy">{row.feature}</td>
                    {row.vals.map((v, j) => (
                      <td key={j} className="text-center py-3 px-2 text-xs">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-[28px] md:text-4xl font-bold text-navy mb-6">
            Find the right level for your child
          </h2>
          <Link to="/book-demo" className="cta-gold text-lg px-8 py-4">
            Book Free Demo
          </Link>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Courses;
