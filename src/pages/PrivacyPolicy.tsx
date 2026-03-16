import SectionWrapper from "@/components/SectionWrapper";

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect personal information that you voluntarily provide when booking a demo class or contacting us. This includes your name, email address, phone number, and your child's name and age. We also collect usage data such as pages visited and time spent on the site.",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use your information to schedule and conduct demo classes, send you updates about our programs, respond to your inquiries, and improve our services. We do not sell, rent, or share your personal information with third parties for marketing purposes.",
  },
  {
    title: "3. Data Storage and Security",
    body: "Your data is stored securely using industry-standard encryption. All data transmission is encrypted via HTTPS.",
  },
  {
    title: "4. Cookies",
    body: "We use essential cookies to ensure the website functions correctly. We do not use tracking or advertising cookies. You can disable cookies in your browser settings, though this may affect website functionality.",
  },
  {
    title: "5. Children's Privacy",
    body: "We are committed to protecting children's privacy. We collect minimal information about children (name and age only) solely for the purpose of providing our educational services. We comply with applicable children's privacy laws including COPPA.",
  },
  {
    title: "6. Your Rights",
    body: "You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at info@tinchess.com.",
  },
  {
    title: "7. Contact Us",
    body: "For privacy-related questions: info@tinchess.com\nThe Intellect Nest, Indore, Madhya Pradesh, India",
  },
];

const PrivacyPolicy = () => (
  <div className="pt-[75px]">
    <section className="bg-navy py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h1 className="font-display text-[34px] md:text-5xl lg:text-[56px] font-black text-white leading-[1.15] mb-4">
          Privacy Policy
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

export default PrivacyPolicy;
