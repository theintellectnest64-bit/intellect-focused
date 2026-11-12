# Intellect Nest Academy

Build a large-scale, multi-page premium website for "The Intellect Nest" — India's premier online chess and Rubik's Cube coaching academy for kids aged 5–15. This is NOT a generic coaching website. It must feel like a world-class institution — dark, editorial, cinematic, minimal. Think Apple meets a chess grandmaster. The website must be so content-rich that a parent exploring it genuinely spends 30–60 minutes going through everything.

I am attaching 3 content files alongside this prompt:
- BLOGS_CONTENT.txt — full text for all 20 blog articles. Use this content exactly for each blog page.
- FAQ_CONTENT.txt — all 50 FAQ questions and answers. Use these exactly on the /faq page.
- COURSES_PRICING_COPY.txt — all course level details, pricing, testimonials, and section copy. Use this exactly.

Before writing any code, use Plan Mode and ask me every clarifying question you need.

---

BRAND

Brand name: The Intellect Nest
Tagline: where knowledge takes flight
Website: tinchess.com
Phone: +91 9893189566
Email: theintellectnest64@gmail.com
WhatsApp: +91 9893189566
Services: Online Chess Classes and Online Rubik's Cube Classes for kids aged 5–15
Target user: Indian parents, primarily mothers aged 28–42, browsing on mobile, discovering chess coaching for their child
Tone: Premium academy. Serious. Institutional. Calm confidence. NOT playful, NOT cartoon, NOT colorful. Think kingdom not kindergarten.

---

TECH STACK AND BACKEND

Frontend: React + Tailwind CSS + Framer Motion
Backend: Supabase
Fonts: Playfair Display for all headings, Inter for all body text (import from Google Fonts)
Routing: React Router v6
Responsive: mobile-first, breakpoints 375px, 768px, 1280px
Accessibility: WCAG 2.1 AA
Every section: skeleton loaders, error states, empty states
sessionStorage for one-time intro animation

Supabase tables:
Table leads: id, created_at, parent_name, child_name, child_age, phone, email, interested_in, current_level, language, preferred_time, source, notes, status (default new)
Table contacts: id, created_at, name, phone, email, subject, message

On every form submission:
1. Save to Supabase
2. Send email to theintellectnest64@gmail.com via Supabase Edge Functions + Resend. Subject: New Lead — [parent_name], [phone]. Body: all submitted fields.
3. Open WhatsApp: https://wa.me/919893189566?text=Hi%2C%20I%20want%20to%20book%20a%20free%20demo%20at%20The%20Intellect%20Nest

---

DESIGN SYSTEM — STRICT, NEVER DEVIATE

Background: #0A1628
Card bg: #0F1E3A
Lighter card: #162040
Gold: #C9A84C
Gold hover: #E8C46A
Gold fill subtle: rgba(201,168,76,0.15)
Gold border: rgba(201,168,76,0.25)
White: #FFFFFF
Secondary text: #CBD5E1
Muted text: #8899AA

H1: 64–72px desktop, 36–42px mobile — Playfair Display
H2: 44–52px desktop, 28–34px mobile — Playfair Display
H3: 28–32px desktop, 22–26px mobile — Playfair Display
Body: 16–18px line-height 1.75 — Inter
Eyebrow labels: Inter uppercase letter-spacing 0.15em gold 12px
Section padding: 120px vertical desktop, 72px mobile
Card radius: 12px. Button radius: 8px. Input radius: 4px.
Card shadow: 0 8px 32px rgba(0,0,0,0.4)
Gold glow on hover: 0 8px 32px rgba(201,168,76,0.2)

Animations: Framer Motion scroll-triggered fade-in + translateY on every section. Card hover: translateY(-6px) + gold glow. Button hover: darken to #A8882A + scale(1.02). Staggered entry on all grids.

FORBIDDEN — never use any of these:
White backgrounds anywhere
Bright colors — no red, green, blue, orange
Cartoon illustrations or emoji as design elements
Lorem ipsum anywhere
Pill-shaped buttons — max radius 8px
Generic stock photos of strangers
Default Lovable purple UI

---

OPENING INTRO ANIMATION

Check sessionStorage key intro_played on load. If not set:
Full-screen overlay #0A1628
Embed YouTube Shorts with iframe API: https://www.youtube.com/shorts/QgAHqfbNSlA — autoplay=1 mute=1 controls=0 playsinline=1
Overlay text fades in centered:
Line 1 Playfair Display 64px gold: The Intellect Nest
Line 2 Inter 18px #CBD5E1 after 1s: where knowledge takes flight
Skip Intro button appears bottom-right after 2s, ghost gold border
On end or skip: fade out overlay, show homepage
Set sessionStorage intro_played = true
If logo animation file is attached, play it as part of the intro

---

GLOBAL ELEMENTS — EVERY PAGE

STICKY HEADER
72px desktop, 60px mobile
Transparent + backdrop blur by default
On 80px scroll: solid #0A1628 + bottom border rgba(201,168,76,0.2) + shadow
Left: uploaded logo. Fallback: The Intellect Nest in Playfair gold
Center desktop nav: Home, About, Courses, Pricing, Blog, Gallery, FAQ, Contact
Right: gold filled button Book Free Demo → /book-demo
Mobile: hamburger → full-screen #0A1628 overlay, gold links, staggered fade-in
Active route: gold underline

FLOATING WHATSAPP BUTTON
Fixed bottom-right z-index 999, 56px gold circle
Outer ring pulse animation every 3s
Tooltip: Chat with us on WhatsApp
Link: https://wa.me/919893189566?text=Hi%2C%20I%20want%20to%20book%20a%20free%20demo%20for%20my%20child%20at%20The%20Intellect%20Nest
Always visible on all pages

BACK TO TOP BUTTON — appears after 400px scroll, bottom-left, gold arrow

FOOTER — 5 columns desktop, stacked mobile
#0A1628 full-width with chess board texture overlay 4% opacity
Column 1: Logo + tagline + 2-line brand description + social icons Instagram YouTube Facebook LinkedIn
Column 2: Quick Links — all pages
Column 3: Courses — all 7 levels
Column 4: Resources — Blog, FAQ, Gallery, Book Demo, Contact
Column 5: +91 9893189566 clickable, theintellectnest64@gmail.com clickable, WhatsApp button, Mon–Sat 9AM–7PM IST
Gold Book a Free Demo button centered above bottom bar
Bottom bar: Copyright 2025 The Intellect Nest. All rights reserved. Privacy Policy. Terms. tinchess.com

---

PAGES TO BUILD

/ — Home
/about — About Us
/courses — Courses and Learning Paths
/pricing — Pricing
/gallery — Gallery and Achievements
/faq — Full FAQ — use all 50 Q&A from FAQ_CONTENT.txt
/blog — Blog index showing all 20 article cards
/blog/chess-best-brain-gym-for-kids — use Blog 1 from BLOGS_CONTENT.txt
/blog/chess-builds-confidence-focus — use Blog 2
/blog/chess-academic-success — use Blog 3
/blog/screen-time-to-smart-time — use Blog 4
/blog/start-early-golden-age-chess — use Blog 5
/blog/chess-vs-video-games — use Blog 6
/blog/chess-emotional-intelligence — use Blog 7
/blog/pawns-to-champions — use Blog 8
/blog/chess-perfect-extracurricular — use Blog 9
/blog/chess-future-skills — use Blog 10
/blog/choose-right-chess-coach — use Blog 11
/blog/chess-openings-for-kids — use Blog 12
/blog/rubiks-cube-benefits-kids — use Blog 13
/blog/chess-leadership-skills — use Blog 14
/blog/online-vs-offline-chess — use Blog 15
/blog/signs-child-ready-competitive-chess — use Blog 16
/blog/parents-support-chess-journey — use Blog 17
/blog/history-of-chess-for-kids — use Blog 18
/blog/chess-and-mathematics — use Blog 19
/blog/30-day-chess-habit-roadmap — use Blog 20
/book-demo — Book a Free Demo with full Supabase form
/contact — Contact page
/admin — Admin dashboard protected with Supabase auth

Total: 32 pages

---

PAGE STRUCTURES

HOME PAGE /
Section 1 HERO: Full 100vh. #0A1628 bg with animated chess grid pattern gold 4% opacity slow drift. Right side: animated chess knight SVG floating up-down 4s ease-in-out infinite gold glow. Left content: Eyebrow — India's Premium Online Chess Academy. H1 — Online Chess and Rubik's Cube Classes for Kids. Subheadline Inter 20px #CBD5E1 — Turn screen time into brain time. Live coach-led sessions, weekly tournaments, and progress reports for ages 5 to 15. Primary CTA gold filled: Book a Free Demo Class → /book-demo. Secondary CTA ghost: Explore Courses → /courses. Trust row: Free demo, No commitment, Hindi and English. Muted small: Serving 500+ students across India and 30+ countries. Staggered fade-in animation.

Section 2 TRUST BAR: Full-width #0F1E3A. 4 animated counters counting up from 0 on scroll: 500+ Students Trained, 3+ Years of Excellence, 20+ Tournament Winners, 4.9 star Parent Rating. Gold icons above, white number, muted label below. Gold 1px separators.

Section 3 WHY CHESS: Eyebrow — Why It Works. H2 — Why Chess Changes Everything for Your Child. Intro para: Chess trains mental skills the way sport trains the body. 6 cards 3-col desktop 2-col tablet 1-col mobile with these topics and copy from COURSES_PRICING_COPY.txt: Focus and Concentration, Logical Thinking, Problem Solving, Emotional Resilience, Academic Performance, Confidence Building. Each card: #0F1E3A bg, gold icon, Playfair H3, Inter body, gold 3px left border. Hover lift + gold glow.

Section 4 LEARNING PATHS PREVIEW: Eyebrow — Our Programs. H2 — Two Paths. One Mission: A Sharper Child. Two large cards side by side: Chess Mastery Program card and Rubik's Cube Program card. Details in COURSES_PRICING_COPY.txt. Each with level progression dots and ghost CTA to /courses.

Section 5 HOW IT WORKS: Eyebrow — Simple Process. H2 — From Curious to Champion in 3 Steps. 3-step horizontal timeline. Step 01 Book Your Free Demo, Step 02 Join Live Online Classes, Step 03 Watch Your Child Grow. Gold numbered circles Playfair. Gold dashed connecting line. Staggered animation.

Section 6 TOOLS WE USE: Eyebrow — World-Class Toolkit. H2 — Professional Tools. For Every Level. 4 tool cards: Zoom, Lichess, ChessBase, Progress Reports. Copy from COURSES_PRICING_COPY.txt.

Section 7 TESTIMONIALS: Eyebrow — Parent Stories. H2 — What Parents Are Saying. 3 testimonial cards swipeable carousel mobile. Use testimonials from COURSES_PRICING_COPY.txt. Gold 5 stars, italic Playfair quote, Inter muted parent detail. Large gold quotation mark bg 8% opacity.

Section 8 FREE DEMO BANNER: Full-width #0F1E3A diagonal gold line texture. H2 gold: Give Your Child the Gift of Smart Screen Time. Subtext: Book a free demo class today — no commitment, no payment required. We will personally call you within 24 hours. Large gold CTA: Book My Free Demo Now — opens modal form with fields: Parent Name, Child Name, Child Age dropdown, Phone, Email, Preferred Time dropdown. On submit: save to Supabase + send email + open WhatsApp.

Section 9 FAQ PREVIEW: Eyebrow — Quick Answers. H2 — Questions Parents Ask. 8 accordion items using first 8 questions from FAQ_CONTENT.txt. Gold rotating chevron. Link: See All 50+ FAQs → /faq.

Section 10 BLOG PREVIEW: Eyebrow — The Journal. H2 — Resources for Parents Who Want More. 3 latest blog cards. Gold ghost button: Explore All Articles → /blog.

---

ABOUT PAGE /about
Hero 60vh: Eyebrow Our Story. H1 — More Than an Academy. A Brain Gym for Kids. Subtext — The Intellect Nest was built on one belief: every child has a sharp mind waiting to be unlocked.
Brand story 2-col: left editorial text from COURSES_PRICING_COPY.txt, right uploaded coach photo.
Mission and Vision: 2 large cards. Use copy from COURSES_PRICING_COPY.txt.
Values: 4 cards — Fun, Focus, Growth, Safety. Copy from COURSES_PRICING_COPY.txt.
Our Approach: 3 columns. Copy from COURSES_PRICING_COPY.txt.
What Makes Us Different: 6 comparison points vs competitors. Copy from COURSES_PRICING_COPY.txt.
Trust stats bar: same as homepage animated counters.
Bottom CTA: Ready to experience the difference? Book Free Demo button.

---

COURSES PAGE /courses
Hero: H1 — From First Move to Champion — A Path for Every Child. Subtext — Two structured programs. Seven progressive levels. One goal: a sharper more confident child.
Tab switcher: Chess tab and Rubik's Cube tab.
Under Chess tab: 5 full level cards alternating left-right layout with ALL details from COURSES_PRICING_COPY.txt for: Beginner Nest, Rising Pawns, Strategic Knights, Tactical Bishops, Master Rooks and Queens.
Under Cube tab: 2 level cards with all details from COURSES_PRICING_COPY.txt for: Cube Basics, Speedcubing Challenge.
Class features full icon list: use copy from COURSES_PRICING_COPY.txt.
Full comparison table across all 7 levels: age, duration, group size, tools, homework, badge, FIDE prep.
Bottom CTA: Find the right level for your child — Book Free Demo.

---

PRICING PAGE /pricing
Hero: H1 — Transparent Pricing. No Hidden Costs. Subtext — Try a free demo first. No payment. No commitment.
Toggle: India Rupees vs International Dollars with smooth price animation.
India view — 3 cards:
Card 1 Group Classes gold Most Popular badge: Rs 2,999 per month. 8 live Zoom classes, weekly tournament, daily puzzles, monthly report, recordings, 6–10 students, badges, WhatsApp updates. CTA Book Free Demo.
Card 2 Private 1-on-1: Rs 4,999 per month. 4 private sessions, personalized curriculum, ChessBase from day 1, direct coach WhatsApp, session notes, fast-track progress. CTA Book Free Demo.
Card 3 School and Custom: Let's Talk. CTA Contact Us → /contact.
International view: Group $49/month, Private $99/month, Custom let's talk.
Pricing details: quarterly 5% discount, sibling discount, GST note, payment methods UPI cards netbanking PayPal.
Pricing FAQ: 8 accordion questions. Use pricing FAQ from FAQ_CONTENT.txt.
Group vs Private comparison table.

---

GALLERY PAGE /gallery
Hero: H1 — Every Milestone. Every Smile. Every Win.
Section 1 Achievement Wall: masonry grid with lightbox. Dark placeholder cards with gold chess icon until real photos uploaded.
Section 2 Class Moments: 3-col grid with captions.
Section 3 Student Spotlights: individual achievement cards.
Section 4 Video Gallery: YouTube embed grid 2-col desktop. Placeholder embed cards until links provided.
Section 5 Tournament Results Table: Tournament Name, Date, Student, Level, Position, Notes. Sortable gold headers.
Section 6 Badges Showcase: all achievement badges visual grid with name, description, how to earn.

---

BLOG INDEX /blog
Hero: H1 — The Journal. Subtext — Deep-dive resources for parents raising curious sharp confident children.
Category filter pills: All, Chess and Kids, Academic Benefits, Parenting, Rubik's Cube, Tournaments.
20 blog cards editorial grid 3-col desktop. Each card: gold category tag, Playfair H3 title, 2-line preview from BLOGS_CONTENT.txt, read time, Read Article link.

---

EACH BLOG PAGE /blog/[slug]
Layout for all 20 blogs:
Hero: article title, category tag, read time, author The Intellect Nest Team
Full article body: use COMPLETE article content from BLOGS_CONTENT.txt for that blog. Do not summarize. Use every word.
H3 subheadings within article
Author section at bottom
3 related article cards
Book a Free Demo CTA banner at bottom of every blog

---

FAQ PAGE /faq
Hero: H1 — 50+ Questions. Every Answer. Live search bar to filter by keyword.
5 grouped accordion sections using ALL 50 Q&A from FAQ_CONTENT.txt:
Group 1 General Q1–Q10
Group 2 Curriculum and Learning Q11–Q20
Group 3 Technology and Setup Q21–Q30
Group 4 Progress and Results Q31–Q40
Group 5 Pricing and Payments Q41–Q50
Smooth accordion open close with gold rotating chevron.

---

BOOK A DEMO PAGE /book-demo
Hero: H1 — Book Your Child's Free Demo Class. Subtext — No commitment. No payment. Just one class that could change everything.
Trust row: 500+ students trained, Free zero commitment, Personal coach match, Response within 24 hours.
2-col layout desktop: form left, trust content right.
Form in #0F1E3A card max-width 640px:
Parent Name required
Child Name required
Child Age required dropdown 4 through 16
Phone required +91 prefix
Email required
Interested In dropdown: Chess Classes, Rubik's Cube, Both
Current Level dropdown: Complete Beginner, Some Experience, Intermediate, Advanced
Preferred Language dropdown: Hindi, English, Both, Other
Preferred Demo Time dropdown: Morning 9AM–12PM, Afternoon 12PM–5PM, Evening 5PM–9PM
How did you hear dropdown: Google Search, Facebook or Instagram, Friend or Family, YouTube, WhatsApp, Other
Message for coach optional textarea
Submit: Confirm My Free Demo Class — full-width large gold filled button
On submit: validate all fields inline gold errors, loading spinner, save to Supabase leads table with source=book-demo, send Resend email to theintellectnest64@gmail.com with subject New Demo Booking — [Child Name] Age [Age], open WhatsApp redirect, show success screen with animated chess knight and message We will call you within 24 hours.
Right side desktop: coach photo, testimonial quote, what happens next 3-step mini timeline, trust badges.

---

CONTACT PAGE /contact
Hero: H1 — Let's Talk. We Respond Within 24 Hours.
2-col layout:
Left: +91 9893189566 tap-to-call gold large, theintellectnest64@gmail.com, WhatsApp Chat Now button, Mon–Sat 9AM–7PM IST, We are fully online serving India and 30+ countries, social icons.
Right: contact form — Parent Name, Phone, Email, Subject dropdown, Message textarea. On submit: save to Supabase contacts table + send email notification + success toast.

---

ADMIN DASHBOARD /admin — SUPABASE AUTH PROTECTED
Login with theintellectnest64@gmail.com
After login:
Stats row: New leads today, this week, this month — gold number cards
Leads table: Name, Child, Age, Phone, Email, Interested In, Source, Date, Status. Filter by status, source, date range. Update status inline. Export CSV button.
Contacts table tab.
Dark navy styling matching main site.
Redirect to login if not authenticated.

---

SEO
Every page: unique meta title, meta description
Keywords: online chess classes for kids, online chess coaching India, chess coaching for kids, chess academy India, chess classes for children
OG image: uploaded logo
Title format: Page Name — The Intellect Nest

---

FILES ATTACHED — USE THESE
Logo PNG or SVG — header, footer, favicon, OG image
Coach photo — About Us page and Book Demo sidebar
Logo animation — intro sequence
BLOGS_CONTENT.txt — full content for all 20 blog pages
FAQ_CONTENT.txt — all 50 FAQ questions and answers
COURSES_PRICING_COPY.txt — all course details, pricing copy, testimonials, section copy

For gallery images: dark placeholder cards with gold chess icon and caption text until real photos uploaded.

---

COMPLETE SITEMAP: / /about /courses /pricing /gallery /faq /blog /blog/chess-best-brain-gym-for-kids /blog/chess-builds-confidence-focus /blog/chess-academic-success /blog/screen-time-to-smart-time /blog/start-early-golden-age-chess /blog/chess-vs-video-games /blog/chess-emotional-intelligence /blog/pawns-to-champions /blog/chess-perfect-extracurricular /blog/chess-future-skills /blog/choose-right-chess-coach /blog/chess-openings-for-kids /blog/rubiks-cube-benefits-kids /blog/chess-leadership-skills /blog/online-vs-offline-chess /blog/signs-child-ready-competitive-chess /blog/parents-support-chess-journey /blog/history-of-chess-for-kids /blog/chess-and-mathematics /blog/30-day-chess-habit-roadmap /book-demo /contact /admin

Total 32 pages.

Before writing any code: confirm you understand the full scope, the Supabase setup, Resend email integration, admin dashboard, intro animation, and that all blog and FAQ content comes from the attached files. Ask every clarifying question now. Use Plan Mode.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://intellect-focused.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e5c206cc-8331-4fd2-8388-b619d8623556).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
