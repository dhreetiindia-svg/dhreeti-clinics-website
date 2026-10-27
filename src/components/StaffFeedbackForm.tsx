import { useMemo, useState } from "react";
import type { FormEvent } from "react";

/**
 * Dhreeti Clinic – Staff & Doctor Feedback Form
 * Place at: src/components/StaffFeedbackForm.tsx
 *
 * - Uses only React + Tailwind + your existing shadcn theme tokens
 *   (bg-background, border-input, bg-primary, text-muted-foreground, ...),
 *   so it picks up your site's current colours and fonts.
 * - Submits by opening WhatsApp with a pre-filled message.
 */

const WHATSAPP_NUMBER = "919901515300";

type StaffMember = { name: string; role?: string };

const DEPARTMENTS: Record<string, StaffMember[]> = {
  "Consulting Doctors": [
    { name: "Dr. Ganesh Pandey", role: "Consultant Physician" },
    { name: "Dr. Pragya Rajesh", role: "Consultant Obstetrician & Gynecologist" },
  ],
  "Registration & Reception": [{ name: "Dip Narayan Mishra" }],
  "Vitals & Triage": [{ name: "Puja Kumari" }],
  "Patient Navigation": [{ name: "Dr. Sanjeev Ji" }, { name: "Roshan" }],
  "Phlebotomy & Day Care": [{ name: "Munna Kumar" }, { name: "Kranti Kumari" }],
  Pharmacy: [
    { name: "Golu Kumar", role: "Pharmacist - dispensing, inventory, dosage guidance" },
  ],
  "Pathology Support": [{ name: "Faizal Ji", role: "Back-end pathology tracking" }],
  "Security & Parking": [{ name: "Upadhyay Ji" }],
};

type Parameter = { id: string; title: string; hint: string };

const PARAMETERS: Parameter[] = [
  {
    id: "politeness",
    title: "Patient Politeness & Communication",
    hint: "Courtesy, respectful addressing, active listening, and empathetic tone towards patients and attendants.",
  },
  {
    id: "grooming",
    title: "Professional Grooming & Uniform Hygiene",
    hint: "Neatness of dress code, professional appearance, ID badge compliance, and personal hygiene standards.",
  },
  {
    id: "tat",
    title: "Turnaround Time (TAT) & Efficiency",
    hint: "Speed and promptness in handling registration, vitals recording, sample collection, dispensing, or patient navigation without unnecessary delays.",
  },
  {
    id: "accuracy",
    title: "Accuracy & Clinical/Administrative Precision",
    hint: "Zero-error record keeping in Purnank HMIS, correct medicine dispensing/dosage explanation by the pharmacist, accurate billing, and proper sample labeling.",
  },
  {
    id: "queue",
    title: "Patient Queue & Flow Management",
    hint: "Ability to smoothly guide patients to doctors, manage waiting areas, handle rush hours calmly, and minimize bottlenecks.",
  },
  {
    id: "inventory",
    title: "Inventory & Resource Management",
    hint: "Proper upkeep, stock maintenance, and timely reporting of pharmacy stock, consumables, and clinic assets (managed by Golu Kumar & team).",
  },
  {
    id: "coordination",
    title: "Inter-Departmental Coordination",
    hint: "Seamless back-end and front-end coordination (e.g., pathology sample dispatch with Faizal Ji, day-care infusion support, and doctor-nursing synergy).",
  },
  {
    id: "crisis",
    title: "Problem-Solving & Crisis Handling",
    hint: "Ability to handle agitated, anxious, or emergency patients and visitors with composure, tact, and de-escalation skills (crucial for reception and security like Upadhyay Ji).",
  },
  {
    id: "punctuality",
    title: "Punctuality & Attendance Discipline",
    hint: "Adherence to duty timings, shift punctuality, and reliability in covering assigned responsibilities.",
  },
  {
    id: "improvement",
    title: "Feedback & Continuous Improvement Attitude",
    hint: "Responsiveness to constructive feedback from management (Dr. Ganesh Pandey & Dr. Pragya Rajesh), willingness to learn, and adaptability to new clinical protocols.",
  },
];

const SCALE = [
  { value: 1, label: "Poor" },
  { value: 2, label: "Fair" },
  { value: 3, label: "Good" },
  { value: 4, label: "Very good" },
  { value: 5, label: "Excellent" },
];

type RatingValue = number | "NA";

const fieldClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function buildWhatsAppMessage(data: {
  patientName: string;
  mobile: string;
  department: string;
  staff: string;
  ratings: Record<string, RatingValue>;
  comments: string;
}) {
  const numeric = Object.values(data.ratings).filter(
    (v): v is number => typeof v === "number",
  );
  const average = numeric.length
    ? (numeric.reduce((a, b) => a + b, 0) / numeric.length).toFixed(1)
    : null;

  const lines: string[] = [
    "*Dhreeti Clinic - Staff & Doctor Feedback*",
    `Date: ${new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}`,
    "",
    "*Patient Details*",
    `Name: ${data.patientName.trim() || "Not provided"}`,
    `Mobile: ${data.mobile.trim() || "Not provided"}`,
    "",
    "*Feedback For*",
    `Department: ${data.department}`,
    `Staff/Doctor: ${data.staff}`,
    "",
    "*Ratings (out of 5)*",
  ];

  PARAMETERS.forEach((p, i) => {
    const v = data.ratings[p.id];
    lines.push(`${i + 1}. ${p.title}: ${v === undefined || v === "NA" ? "N/A" : `${v}/5`}`);
  });

  if (average) lines.push("", `*Average: ${average}/5*`);
  lines.push("", "*Comments*", data.comments.trim() || "None");

  return lines.join("\n");
}

export default function StaffFeedbackForm() {
  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [department, setDepartment] = useState("");
  const [staff, setStaff] = useState("");
  const [ratings, setRatings] = useState<Record<string, RatingValue>>({});
  const [comments, setComments] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const staffOptions = useMemo(() => (department ? DEPARTMENTS[department] : []), [department]);
  const selectedStaff = staffOptions.find((s) => s.name === staff);

  function handleDepartmentChange(value: string) {
    setDepartment(value);
    setStaff(""); // reset dependent dropdown
  }

  function setRating(id: string, value: RatingValue) {
    setRatings((r) => ({ ...r, [id]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const problems: string[] = [];

    if (!department) problems.push("Select a department.");
    else if (!staff) problems.push("Select the staff member or doctor.");

    const mobileDigits = mobile.replace(/[\s()+-]/g, "");
    if (mobile.trim() && !/^(91)?[6-9]\d{9}$/.test(mobileDigits)) {
      problems.push("Enter a valid 10-digit mobile number, or leave it blank.");
    }

    const rated = PARAMETERS.some((p) => typeof ratings[p.id] === "number");
    if (!rated) problems.push("Rate at least one parameter.");

    setErrors(problems);
    if (problems.length) return;

    const message = buildWhatsAppMessage({ patientName, mobile, department, staff, ratings, comments });
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8 text-foreground"
    >
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Staff & Doctor Feedback
        </h1>
        <p className="text-sm text-muted-foreground">
          Tell us about your experience at Dhreeti Clinic. Your feedback opens in WhatsApp,
          and you send it from there.
        </p>
      </header>

      {/* Patient details */}
      <fieldset className="space-y-4">
        <legend className="mb-1 text-lg font-medium">Patient details (optional)</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="fb-name" className="text-sm font-medium">
              Patient name
            </label>
            <input
              id="fb-name"
              type="text"
              autoComplete="name"
              className={fieldClass}
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="fb-mobile" className="text-sm font-medium">
              Mobile number
            </label>
            <input
              id="fb-mobile"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className={fieldClass}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile number"
            />
          </div>
        </div>
      </fieldset>

      {/* Department → staff */}
      <fieldset className="space-y-4">
        <legend className="mb-1 text-lg font-medium">Who is your feedback for?</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="fb-dept" className="text-sm font-medium">
              Department
            </label>
            <select
              id="fb-dept"
              className={fieldClass}
              value={department}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              required
            >
              <option value="">Select department</option>
              {Object.keys(DEPARTMENTS).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="fb-staff" className="text-sm font-medium">
              Staff / Doctor
            </label>
            <select
              id="fb-staff"
              className={fieldClass}
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
              disabled={!department}
              required
            >
              <option value="">{department ? "Select staff member" : "Select a department first"}</option>
              {staffOptions.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            {selectedStaff?.role && (
              <p className="text-xs text-muted-foreground">{selectedStaff.role}</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Ratings */}
      <section className="space-y-4" aria-labelledby="fb-ratings-title">
        <div className="space-y-1">
          <h2 id="fb-ratings-title" className="text-lg font-medium">
            Rate your experience
          </h2>
          <p className="text-sm text-muted-foreground">
            1 is poor and 5 is excellent. Choose N/A for anything that does not apply to this person.
          </p>
        </div>

        <div className="divide-y divide-border rounded-lg border border-border">
          {PARAMETERS.map((p, i) => {
            const current = ratings[p.id];
            return (
              <fieldset key={p.id} className="space-y-3 p-4">
                <legend className="sr-only">{p.title}</legend>
                <div className="space-y-1">
                  <p className="font-medium">
                    {i + 1}. {p.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{p.hint}</p>
                </div>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={p.title}>
                  {SCALE.map((s) => {
                    const active = current === s.value;
                    return (
                      <label
                        key={s.value}
                        title={s.label}
                        className={`flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`rating-${p.id}`}
                          value={s.value}
                          checked={active}
                          onChange={() => setRating(p.id, s.value)}
                          className="sr-only"
                        />
                        {s.value}
                        <span className="sr-only"> - {s.label}</span>
                      </label>
                    );
                  })}
                  <label
                    className={`flex h-10 cursor-pointer items-center justify-center rounded-md border px-3 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
                      current === "NA"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`rating-${p.id}`}
                      value="NA"
                      checked={current === "NA"}
                      onChange={() => setRating(p.id, "NA")}
                      className="sr-only"
                    />
                    N/A
                  </label>
                </div>
              </fieldset>
            );
          })}
        </div>
      </section>

      {/* Comments */}
      <div className="space-y-1.5">
        <label htmlFor="fb-comments" className="text-lg font-medium">
          Additional comments (optional)
        </label>
        <textarea
          id="fb-comments"
          rows={4}
          maxLength={500}
          className={`${fieldClass} h-auto py-2`}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Anything we should know or improve?"
        />
        <p className="text-xs text-muted-foreground">{comments.length}/500</p>
      </div>

      {errors.length > 0 && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <ul className="list-disc space-y-1 pl-5">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
      >
        Send feedback on WhatsApp
      </button>
    </form>
  );
}
