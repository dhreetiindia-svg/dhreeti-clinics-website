import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

/**
 * Dhreeti Clinic – Staff & Doctor Feedback Form (English / हिन्दी / اردو)
 * Place at: src/components/StaffFeedbackForm.tsx
 *
 * - Language is picked with the switcher at the top of the form, or via
 *   /feedback?lang=hi  or  /feedback?lang=ur  (the site header can pass it).
 * - The WhatsApp message is always written in English so the clinic team can
 *   read every submission the same way.
 */

const WHATSAPP_NUMBER = "919901515300";

type Locale = "en" | "hi" | "ur";

const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  ur: "اردو",
};

/* ---------- Data (English keys are what goes into the WhatsApp message) ---------- */

type StaffMember = { name: string; role?: string };

const DEPARTMENTS: Record<string, StaffMember[]> = {
  "Consulting Doctors": [
    { name: "Dr. Ganesh Pandey", role: "Consultant Physician" },
    { name: "Dr. Pragya Rajesh", role: "Consultant Obstetrician & Gynecologist" },
  ],
  "Registration & Reception": [{ name: "Dip Narayan Mishra" }],
  "Vitals & Triage": [{ name: "Puja Kumari" }],
  "Patient Navigation": [{ name: "Sanjeev Ji" }, { name: "Roshan" }],
  "Phlebotomy & Day Care": [{ name: "Munna Kumar" }, { name: "Kranti Kumari" }],
  Pharmacy: [
    { name: "Golu Kumar", role: "Pharmacist - dispensing, inventory, dosage guidance" },
  ],
  "Pathology Support": [{ name: "Faizal Ji", role: "Back-end pathology tracking" }],
  "Security & Parking": [{ name: "Upadhyay Ji" }],
};

const PARAMETER_IDS = [
  "politeness",
  "grooming",
  "tat",
  "accuracy",
  "queue",
  "inventory",
  "coordination",
  "crisis",
  "punctuality",
  "improvement",
] as const;

const PARAMETER_TITLES_EN: Record<string, string> = {
  politeness: "Patient Politeness & Communication",
  grooming: "Professional Grooming & Uniform Hygiene",
  tat: "Turnaround Time (TAT) & Efficiency",
  accuracy: "Accuracy & Clinical/Administrative Precision",
  queue: "Patient Queue & Flow Management",
  inventory: "Inventory & Resource Management",
  coordination: "Inter-Departmental Coordination",
  crisis: "Problem-Solving & Crisis Handling",
  punctuality: "Punctuality & Attendance Discipline",
  improvement: "Feedback & Continuous Improvement Attitude",
};

/* ---------- Translations ---------- */

type ErrKey = "dept" | "staff" | "mobile" | "rating";

type Copy = {
  title: string;
  intro: string;
  patientLegend: string;
  nameLabel: string;
  namePh: string;
  mobileLabel: string;
  mobilePh: string;
  whoLegend: string;
  deptLabel: string;
  deptPh: string;
  staffLabel: string;
  staffPh: string;
  staffPhFirst: string;
  rateTitle: string;
  rateHint: string;
  scale: string[];
  na: string;
  commentsLabel: string;
  commentsPh: string;
  submit: string;
  back: string;
  err: Record<ErrKey, string>;
  depts: Record<string, string>;
  roles: Record<string, string>;
  params: Record<string, { title: string; hint: string }>;
};

const COPY: Record<Locale, Copy> = {
  en: {
    title: "Staff & Doctor Feedback",
    intro:
      "Tell us about your experience at Dhreeti Clinic. Your feedback opens in WhatsApp, and you send it from there.",
    patientLegend: "Patient details (optional)",
    nameLabel: "Patient name",
    namePh: "Your name",
    mobileLabel: "Mobile number",
    mobilePh: "10-digit mobile number",
    whoLegend: "Who is your feedback for?",
    deptLabel: "Department",
    deptPh: "Select department",
    staffLabel: "Staff / Doctor",
    staffPh: "Select staff member",
    staffPhFirst: "Select a department first",
    rateTitle: "Rate your experience",
    rateHint:
      "1 is poor and 5 is excellent. Choose N/A for anything that does not apply to this person.",
    scale: ["Poor", "Fair", "Good", "Very good", "Excellent"],
    na: "N/A",
    commentsLabel: "Additional comments (optional)",
    commentsPh: "Anything we should know or improve?",
    submit: "Send feedback on WhatsApp",
    back: "← Back to home",
    err: {
      dept: "Select a department.",
      staff: "Select the staff member or doctor.",
      mobile: "Enter a valid 10-digit mobile number, or leave it blank.",
      rating: "Rate at least one parameter.",
    },
    depts: {},
    roles: {},
    params: {
      politeness: {
        title: "Patient Politeness & Communication",
        hint: "Courtesy, respectful addressing, active listening, and empathetic tone towards patients and attendants.",
      },
      grooming: {
        title: "Professional Grooming & Uniform Hygiene",
        hint: "Neatness of dress code, professional appearance, ID badge compliance, and personal hygiene standards.",
      },
      tat: {
        title: "Turnaround Time (TAT) & Efficiency",
        hint: "Speed and promptness in handling registration, vitals recording, sample collection, dispensing, or patient navigation without unnecessary delays.",
      },
      accuracy: {
        title: "Accuracy & Clinical/Administrative Precision",
        hint: "Zero-error record keeping in Purnank HMIS, correct medicine dispensing/dosage explanation by the pharmacist, accurate billing, and proper sample labeling.",
      },
      queue: {
        title: "Patient Queue & Flow Management",
        hint: "Ability to smoothly guide patients to doctors, manage waiting areas, handle rush hours calmly, and minimize bottlenecks.",
      },
      inventory: {
        title: "Inventory & Resource Management",
        hint: "Proper upkeep, stock maintenance, and timely reporting of pharmacy stock, consumables, and clinic assets (managed by Golu Kumar & team).",
      },
      coordination: {
        title: "Inter-Departmental Coordination",
        hint: "Seamless back-end and front-end coordination (e.g., pathology sample dispatch with Faizal Ji, day-care infusion support, and doctor-nursing synergy).",
      },
      crisis: {
        title: "Problem-Solving & Crisis Handling",
        hint: "Ability to handle agitated, anxious, or emergency patients and visitors with composure, tact, and de-escalation skills (crucial for reception and security like Upadhyay Ji).",
      },
      punctuality: {
        title: "Punctuality & Attendance Discipline",
        hint: "Adherence to duty timings, shift punctuality, and reliability in covering assigned responsibilities.",
      },
      improvement: {
        title: "Feedback & Continuous Improvement Attitude",
        hint: "Responsiveness to constructive feedback from management (Dr. Ganesh Pandey & Dr. Pragya Rajesh), willingness to learn, and adaptability to new clinical protocols.",
      },
    },
  },

  hi: {
    title: "स्टाफ़ और डॉक्टर फ़ीडबैक",
    intro:
      "Dhreeti Clinic में अपने अनुभव के बारे में हमें बताएँ। आपका फ़ीडबैक WhatsApp में खुलेगा, और आप वहीं से भेजेंगे।",
    patientLegend: "मरीज़ का विवरण (वैकल्पिक)",
    nameLabel: "मरीज़ का नाम",
    namePh: "आपका नाम",
    mobileLabel: "मोबाइल नंबर",
    mobilePh: "10 अंकों का मोबाइल नंबर",
    whoLegend: "फ़ीडबैक किसके लिए है?",
    deptLabel: "विभाग",
    deptPh: "विभाग चुनें",
    staffLabel: "स्टाफ़ / डॉक्टर",
    staffPh: "स्टाफ़ सदस्य चुनें",
    staffPhFirst: "पहले विभाग चुनें",
    rateTitle: "अपना अनुभव रेट करें",
    rateHint:
      "1 का मतलब खराब और 5 का मतलब बहुत बढ़िया। जो बात इस व्यक्ति पर लागू न हो, उसके लिए 'लागू नहीं' चुनें।",
    scale: ["खराब", "ठीक-ठाक", "अच्छा", "बहुत अच्छा", "उत्कृष्ट"],
    na: "लागू नहीं",
    commentsLabel: "अतिरिक्त टिप्पणी (वैकल्पिक)",
    commentsPh: "कुछ और बताना चाहें या सुधार का सुझाव?",
    submit: "WhatsApp पर फ़ीडबैक भेजें",
    back: "← होम पर वापस जाएँ",
    err: {
      dept: "विभाग चुनें।",
      staff: "स्टाफ़ सदस्य या डॉक्टर चुनें।",
      mobile: "सही 10 अंकों का मोबाइल नंबर लिखें, या खाली छोड़ दें।",
      rating: "कम से कम एक बिंदु को रेट करें।",
    },
    depts: {
      "Consulting Doctors": "परामर्श डॉक्टर",
      "Registration & Reception": "रजिस्ट्रेशन और रिसेप्शन",
      "Vitals & Triage": "वाइटल्स और ट्राइएज",
      "Patient Navigation": "मरीज़ मार्गदर्शन",
      "Phlebotomy & Day Care": "सैंपल कलेक्शन और डे केयर",
      Pharmacy: "फ़ार्मेसी",
      "Pathology Support": "पैथोलॉजी सहायता",
      "Security & Parking": "सुरक्षा और पार्किंग",
    },
    roles: {
      "Consultant Physician": "कंसल्टेंट फ़िज़िशियन",
      "Consultant Obstetrician & Gynecologist": "कंसल्टेंट प्रसूति एवं स्त्री रोग विशेषज्ञ",
      "Pharmacist - dispensing, inventory, dosage guidance":
        "फ़ार्मासिस्ट - दवा वितरण, स्टॉक, खुराक मार्गदर्शन",
      "Back-end pathology tracking": "पैथोलॉजी की बैक-एंड ट्रैकिंग",
    },
    params: {
      politeness: {
        title: "मरीज़ों के प्रति विनम्रता और बातचीत",
        hint: "शिष्टाचार, सम्मानपूर्वक संबोधन, ध्यान से सुनना, और मरीज़ों व उनके साथ आए लोगों के प्रति सहानुभूतिपूर्ण लहजा।",
      },
      grooming: {
        title: "पेशेवर रहन-सहन और यूनिफ़ॉर्म की स्वच्छता",
        hint: "पोशाक की सफ़ाई, पेशेवर दिखावट, आईडी बैज का पालन, और व्यक्तिगत स्वच्छता के मानक।",
      },
      tat: {
        title: "टर्नअराउंड टाइम (TAT) और कार्यकुशलता",
        hint: "रजिस्ट्रेशन, वाइटल्स दर्ज करने, सैंपल लेने, दवा देने या मरीज़ को मार्गदर्शन देने में बिना अनावश्यक देरी के तेज़ी और तत्परता।",
      },
      accuracy: {
        title: "सटीकता और क्लिनिकल/प्रशासनिक शुद्धता",
        hint: "पूर्णांक HMIS में बिना गलती के रिकॉर्ड, फ़ार्मासिस्ट द्वारा दवा और खुराक की सही जानकारी, सही बिलिंग, और सैंपल पर सही लेबलिंग।",
      },
      queue: {
        title: "मरीज़ों की कतार और प्रवाह प्रबंधन",
        hint: "मरीज़ों को डॉक्टर तक सहजता से पहुँचाना, प्रतीक्षा क्षेत्र संभालना, भीड़ के समय शांति से काम करना, और रुकावटें कम करना।",
      },
      inventory: {
        title: "इन्वेंटरी और संसाधन प्रबंधन",
        hint: "फ़ार्मेसी स्टॉक, उपभोग्य सामग्री और क्लिनिक की संपत्ति की उचित देखभाल, स्टॉक बनाए रखना, और समय पर सूचना देना (गोलू कुमार और टीम द्वारा संचालित)।",
      },
      coordination: {
        title: "विभागों के बीच समन्वय",
        hint: "पर्दे के पीछे और सामने के काम में सहज तालमेल (जैसे फ़ैज़ल जी के साथ पैथोलॉजी सैंपल भेजना, डे केयर में इन्फ़्यूज़न सहायता, और डॉक्टर-नर्सिंग तालमेल)।",
      },
      crisis: {
        title: "समस्या समाधान और संकट प्रबंधन",
        hint: "उत्तेजित, चिंतित या आपात स्थिति वाले मरीज़ों और आगंतुकों को शांति, समझदारी और स्थिति सँभालने के कौशल से सँभालना (रिसेप्शन और सुरक्षा, जैसे उपाध्याय जी, के लिए विशेष रूप से ज़रूरी)।",
      },
      punctuality: {
        title: "समय की पाबंदी और उपस्थिति अनुशासन",
        hint: "ड्यूटी के समय, शिफ़्ट की पाबंदी, और सौंपी गई ज़िम्मेदारियाँ निभाने में भरोसेमंद होना।",
      },
      improvement: {
        title: "प्रतिक्रिया और निरंतर सुधार का रवैया",
        hint: "प्रबंधन (डॉ. गणेश पांडेय और डॉ. प्रज्ञा राजेश) की रचनात्मक सलाह पर प्रतिक्रिया, सीखने की इच्छा, और नए क्लिनिकल प्रोटोकॉल अपनाने की क्षमता।",
      },
    },
  },

  ur: {
    title: "اسٹاف اور ڈاکٹر فیڈبیک",
    intro:
      "Dhreeti Clinic میں اپنے تجربے کے بارے میں ہمیں بتائیں۔ آپ کا فیڈبیک WhatsApp میں کھلے گا، اور آپ وہیں سے بھیجیں گے۔",
    patientLegend: "مریض کی تفصیلات (اختیاری)",
    nameLabel: "مریض کا نام",
    namePh: "آپ کا نام",
    mobileLabel: "موبائل نمبر",
    mobilePh: "10 ہندسوں کا موبائل نمبر",
    whoLegend: "فیڈبیک کس کے لیے ہے؟",
    deptLabel: "شعبہ",
    deptPh: "شعبہ منتخب کریں",
    staffLabel: "اسٹاف / ڈاکٹر",
    staffPh: "اسٹاف ممبر منتخب کریں",
    staffPhFirst: "پہلے شعبہ منتخب کریں",
    rateTitle: "اپنے تجربے کو ریٹ کریں",
    rateHint:
      "1 کا مطلب خراب اور 5 کا مطلب بہت اچھا۔ جو بات اس شخص پر لاگو نہ ہو اس کے لیے 'لاگو نہیں' منتخب کریں۔",
    scale: ["خراب", "مناسب", "اچھا", "بہت اچھا", "بہترین"],
    na: "لاگو نہیں",
    commentsLabel: "اضافی تبصرہ (اختیاری)",
    commentsPh: "کچھ اور بتانا چاہیں یا بہتری کی تجویز؟",
    submit: "WhatsApp پر فیڈبیک بھیجیں",
    back: "← ہوم پر واپس جائیں",
    err: {
      dept: "شعبہ منتخب کریں۔",
      staff: "اسٹاف ممبر یا ڈاکٹر منتخب کریں۔",
      mobile: "درست 10 ہندسوں کا موبائل نمبر لکھیں، یا خالی چھوڑ دیں۔",
      rating: "کم از کم ایک نکتے کو ریٹ کریں۔",
    },
    depts: {
      "Consulting Doctors": "مشاورتی ڈاکٹر",
      "Registration & Reception": "رجسٹریشن اور ریسپشن",
      "Vitals & Triage": "وائٹلز اور ٹرائیج",
      "Patient Navigation": "مریضوں کی رہنمائی",
      "Phlebotomy & Day Care": "سیمپل کلیکشن اور ڈے کیئر",
      Pharmacy: "فارمیسی",
      "Pathology Support": "پیتھالوجی سپورٹ",
      "Security & Parking": "سیکیورٹی اور پارکنگ",
    },
    roles: {
      "Consultant Physician": "کنسلٹنٹ فزیشن",
      "Consultant Obstetrician & Gynecologist": "کنسلٹنٹ ماہرِ امراضِ نسواں و زچگی",
      "Pharmacist - dispensing, inventory, dosage guidance":
        "فارماسسٹ - ادویات کی فراہمی، اسٹاک، خوراک کی رہنمائی",
      "Back-end pathology tracking": "پیتھالوجی کی بیک اینڈ ٹریکنگ",
    },
    params: {
      politeness: {
        title: "مریضوں سے شائستگی اور گفتگو",
        hint: "حسنِ سلوک، احترام سے مخاطب کرنا، توجہ سے سننا، اور مریضوں اور ان کے ساتھ آنے والوں کے ساتھ ہمدردانہ لہجہ۔",
      },
      grooming: {
        title: "پیشہ ورانہ وضع قطع اور یونیفارم کی صفائی",
        hint: "لباس کی صفائی، پیشہ ورانہ ظاہری حلیہ، آئی ڈی بیج کی پابندی، اور ذاتی صفائی کا معیار۔",
      },
      tat: {
        title: "ٹرن اراؤنڈ ٹائم (TAT) اور کارکردگی",
        hint: "رجسٹریشن، وائٹلز ریکارڈ کرنے، سیمپل لینے، دوا دینے یا مریض کی رہنمائی میں بغیر غیر ضروری تاخیر کے تیزی اور پھرتی۔",
      },
      accuracy: {
        title: "درستگی اور طبی/انتظامی احتیاط",
        hint: "پورنانک HMIS میں بغیر غلطی کے ریکارڈ، فارماسسٹ کی طرف سے دوا اور خوراک کی درست وضاحت، درست بلنگ، اور سیمپل پر صحیح لیبلنگ۔",
      },
      queue: {
        title: "مریضوں کی قطار اور بہاؤ کا انتظام",
        hint: "مریضوں کو ڈاکٹر تک آسانی سے پہنچانا، انتظار گاہ سنبھالنا، رش کے اوقات میں سکون سے کام لینا، اور رکاوٹیں کم کرنا۔",
      },
      inventory: {
        title: "انوینٹری اور وسائل کا انتظام",
        hint: "فارمیسی اسٹاک، استعمال کی اشیاء اور کلینک کے اثاثوں کی مناسب دیکھ بھال، اسٹاک برقرار رکھنا، اور بروقت اطلاع دینا (گولو کمار اور ٹیم کے زیرِ انتظام)۔",
      },
      coordination: {
        title: "شعبوں کے درمیان رابطہ کاری",
        hint: "پسِ پردہ اور سامنے کے کام میں بہترین ہم آہنگی (مثلاً فیضل جی کے ساتھ پیتھالوجی سیمپل کی ترسیل، ڈے کیئر میں انفیوژن کی معاونت، اور ڈاکٹر اور نرسنگ کا باہمی تعاون)۔",
      },
      crisis: {
        title: "مسئلہ حل کرنا اور بحران سے نمٹنا",
        hint: "مشتعل، پریشان یا ہنگامی حالت والے مریضوں اور ملاقاتیوں کو سکون، سلیقے اور حالات ٹھنڈے کرنے کی مہارت سے سنبھالنا (ریسپشن اور سیکیورٹی، جیسے اپادھیائے جی، کے لیے خاص طور پر اہم)۔",
      },
      punctuality: {
        title: "وقت کی پابندی اور حاضری کا نظم",
        hint: "ڈیوٹی کے اوقات، شفٹ کی پابندی، اور سونپی گئی ذمہ داریاں نبھانے میں قابلِ اعتماد ہونا۔",
      },
      improvement: {
        title: "آراء اور مسلسل بہتری کا رویہ",
        hint: "انتظامیہ (ڈاکٹر گنیش پانڈے اور ڈاکٹر پرگیا راجیش) کی تعمیری رائے پر ردعمل، سیکھنے کی آمادگی، اور نئے طبی پروٹوکول کو اپنانے کی صلاحیت۔",
      },
    },
  },
};

/* ---------- Helpers ---------- */

type RatingValue = number | "NA";

const STORAGE_KEY = "feedback-lang";

function toLocale(value: string | null | undefined): Locale | null {
  const v = (value ?? "").toLowerCase();
  if (v.startsWith("hi")) return "hi";
  if (v.startsWith("ur")) return "ur";
  if (v.startsWith("en")) return "en";
  return null;
}

const fieldClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

/** The WhatsApp message is always in English. */
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

  PARAMETER_IDS.forEach((id, i) => {
    const v = data.ratings[id];
    lines.push(
      `${i + 1}. ${PARAMETER_TITLES_EN[id]}: ${v === undefined || v === "NA" ? "N/A" : `${v}/5`}`,
    );
  });

  if (average) lines.push("", `*Average: ${average}/5*`);
  lines.push("", "*Comments*", data.comments.trim() || "None");

  return lines.join("\n");
}

/* ---------- Component ---------- */

export default function StaffFeedbackForm() {
  const [locale, setLocale] = useState<Locale>("en");
  const [patientName, setPatientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [department, setDepartment] = useState("");
  const [staff, setStaff] = useState("");
  const [ratings, setRatings] = useState<Record<string, RatingValue>>({});
  const [comments, setComments] = useState("");
  const [errors, setErrors] = useState<ErrKey[]>([]);

  const t = COPY[locale];
  const isRtl = locale === "ur";

  // Pick the starting language: ?lang= in the link, else last choice, else English.
  useEffect(() => {
    try {
      const fromUrl = toLocale(new URLSearchParams(window.location.search).get("lang"));
      const fromStore = toLocale(window.localStorage.getItem(STORAGE_KEY));
      setLocale(fromUrl ?? fromStore ?? "en");
    } catch {
      /* storage can be blocked; stay on English */
    }
  }, []);

  function changeLocale(next: Locale) {
    setLocale(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }

  const staffOptions = useMemo(() => (department ? DEPARTMENTS[department] : []), [department]);
  const selectedStaff = staffOptions.find((s) => s.name === staff);

  function handleDepartmentChange(value: string) {
    setDepartment(value);
    setStaff("");
  }

  function setRating(id: string, value: RatingValue) {
    setRatings((r) => ({ ...r, [id]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const problems: ErrKey[] = [];

    if (!department) problems.push("dept");
    else if (!staff) problems.push("staff");

    const mobileDigits = mobile.replace(/[\s()+-]/g, "");
    if (mobile.trim() && !/^(91)?[6-9]\d{9}$/.test(mobileDigits)) problems.push("mobile");

    if (!PARAMETER_IDS.some((id) => typeof ratings[id] === "number")) problems.push("rating");

    setErrors(problems);
    if (problems.length) return;

    const message = buildWhatsAppMessage({ patientName, mobile, department, staff, ratings, comments });
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      dir={isRtl ? "rtl" : "ltr"}
      lang={locale}
      className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8 text-foreground"
    >
      {/* Top bar: back link + language switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <a href="/" className="text-sm font-medium text-primary hover:underline">
          {t.back}
        </a>
        <div className="inline-flex overflow-hidden rounded-md border border-border" role="group" aria-label="Language">
          {(Object.keys(LOCALE_NAMES) as Locale[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => changeLocale(l)}
              aria-pressed={locale === l}
              className={`min-h-10 px-3 text-sm font-medium transition-colors ${
                locale === l
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {LOCALE_NAMES[l]}
            </button>
          ))}
        </div>
      </div>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.title}</h1>
        <p className="text-sm text-muted-foreground">{t.intro}</p>
      </header>

      {/* Patient details */}
      <fieldset className="space-y-4">
        <legend className="mb-1 text-lg font-medium">{t.patientLegend}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="fb-name" className="text-sm font-medium">
              {t.nameLabel}
            </label>
            <input
              id="fb-name"
              type="text"
              autoComplete="name"
              className={fieldClass}
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder={t.namePh}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="fb-mobile" className="text-sm font-medium">
              {t.mobileLabel}
            </label>
            <input
              id="fb-mobile"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              className={`${fieldClass} ${isRtl ? "text-right" : ""}`}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder={t.mobilePh}
            />
          </div>
        </div>
      </fieldset>

      {/* Department → staff */}
      <fieldset className="space-y-4">
        <legend className="mb-1 text-lg font-medium">{t.whoLegend}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="fb-dept" className="text-sm font-medium">
              {t.deptLabel}
            </label>
            <select
              id="fb-dept"
              className={fieldClass}
              value={department}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              required
            >
              <option value="">{t.deptPh}</option>
              {Object.keys(DEPARTMENTS).map((d) => (
                <option key={d} value={d}>
                  {t.depts[d] ?? d}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="fb-staff" className="text-sm font-medium">
              {t.staffLabel}
            </label>
            <select
              id="fb-staff"
              className={fieldClass}
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
              disabled={!department}
              required
            >
              <option value="">{department ? t.staffPh : t.staffPhFirst}</option>
              {staffOptions.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            {selectedStaff?.role && (
              <p className="text-xs text-muted-foreground">
                {t.roles[selectedStaff.role] ?? selectedStaff.role}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Ratings */}
      <section className="space-y-4" aria-labelledby="fb-ratings-title">
        <div className="space-y-1">
          <h2 id="fb-ratings-title" className="text-lg font-medium">
            {t.rateTitle}
          </h2>
          <p className="text-sm text-muted-foreground">{t.rateHint}</p>
        </div>

        <div className="divide-y divide-border rounded-lg border border-border">
          {PARAMETER_IDS.map((id, i) => {
            const current = ratings[id];
            const p = t.params[id];
            return (
              <fieldset key={id} className="space-y-3 p-4">
                <legend className="sr-only">{p.title}</legend>
                <div className="space-y-1">
                  <p className="font-medium">
                    {i + 1}. {p.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{p.hint}</p>
                </div>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={p.title}>
                  {[1, 2, 3, 4, 5].map((value) => {
                    const active = current === value;
                    return (
                      <label
                        key={value}
                        title={t.scale[value - 1]}
                        className={`flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`rating-${id}`}
                          value={value}
                          checked={active}
                          onChange={() => setRating(id, value)}
                          className="sr-only"
                        />
                        {value}
                        <span className="sr-only"> - {t.scale[value - 1]}</span>
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
                      name={`rating-${id}`}
                      value="NA"
                      checked={current === "NA"}
                      onChange={() => setRating(id, "NA")}
                      className="sr-only"
                    />
                    {t.na}
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
          {t.commentsLabel}
        </label>
        <textarea
          id="fb-comments"
          rows={4}
          maxLength={500}
          className={`${fieldClass} h-auto py-2`}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder={t.commentsPh}
        />
        <p className="text-xs text-muted-foreground" dir="ltr">
          {comments.length}/500
        </p>
      </div>

      {errors.length > 0 && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <ul className="list-disc space-y-1 ps-5">
            {errors.map((key) => (
              <li key={key}>{t.err[key]}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
      >
        {t.submit}
      </button>
    </form>
  );
}
