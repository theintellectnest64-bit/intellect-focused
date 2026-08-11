import ZoomMeetingPage from "@/components/ZoomMeetingPage";

/* ── Second teacher's Zoom credentials — replace these three values only ── */
const DEMO_ZOOM_LINK = "https://us06web.zoom.us/j/9516242285?pwd=cDbLjLjPXL3Un6baBwLh3F4JGFRBHm.1";
const DEMO_MEETING_ID = "951 624 2285";
const DEMO_PASSCODE = "123456";

const Demo = () => (
  <ZoomMeetingPage
    zoomLink={DEMO_ZOOM_LINK}
    meetingId={DEMO_MEETING_ID}
    passcode={DEMO_PASSCODE}
  />
);

export default Demo;
