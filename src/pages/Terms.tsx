import SectionWrapper from "@/components/SectionWrapper";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing and using The Intellect Nest website and services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.",
  },
  {
    title: "2. Services",
    body: "The Intellect Nest provides online chess and Rubik's Cube coaching classes for children aged 4–16. Classes are conducted live via Zoom. Class schedules, coaches, and curriculum are subject to change with reasonable notice.",
  },
  {
    title: "3. Payments and Refunds",
    body: "All fees are due at the beginning of each billing cycle. Pro-rated refunds are available within 7 days of the billing cycle start. No refunds are provided for missed classes; however, recorded replays are available. One pause per quarter is permitted with 7 days notice.",
  },
  {
    title: "4. Code of Conduct",
    body: "All students, parents, and coaches are expected to maintain respectful behavior during all sessions. The Intellect Nest reserves the right to terminate enrollment without refund in cases of serious misconduct.",
  },
  {
    title: "5. Intellectual Property",
    body: "All course materials, videos, and content provided by The Intellect Nest are proprietary and may not be reproduced, shared, or distributed without written permission.",
  },
  {
    title: "6. Limitation of Liability",
    body: "The Intellect Nest is not liable for technical issues beyond our control, including internet connectivity problems or platform outages. We will make reasonable efforts to provide makeup sessions in such cases.",
  },
  {
    title: "7. Governing Law",
    body: "These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Indore, Madhya Pradesh.",
  },
  {
    title: "8. Contact",
    body: "For questions about these terms: info@tinchess.com",
  },
];

const Terms = () => (
  <div className="pt-[75px]">
    <section className="bg-navy py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h1 className="font-display text-[34px] md:text-5xl lg:text-[56px] font-black text-white leading-[1.15] mb-4">
          Terms and Conditions
        </h1>
        <p className="font-body text-lg" style={{ color: "#93C5FD" }}>
          Last updated: March 2025
        </p>
      </div>
    </section>
    <SectionWrapper>
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-xl md:text-2xl font-bold text-navy mb-3">{s.title}</h2>
              <p className="font-body text-base text-secondary leading-relaxed whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  </div>
);

export default Terms;
