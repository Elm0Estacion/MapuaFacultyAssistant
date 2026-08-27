export interface HandbookSection {
  id: string;
  part: string;
  sectionNumber: string;
  title: string;
  category: "Academics" | "Grading & Honors" | "AI Policy" | "Admissions & Shifting" | "Student Life & Discipline" | "Services & Facilities" | "History & Identity";
  summary: string;
  keyPoints: string[];
  referenceText: string;
  samplePrompt: string;
}

export const MAPUA_ACADEMIC_HANDBOOK_YEAR = "A.Y. 2026 - 2027";

export const MAPUA_HANDBOOK_SECTIONS: HandbookSection[] = [
  {
    id: "gen-ai-policy",
    part: "PART D: INSTITUTIONAL POLICIES",
    sectionNumber: "Section III",
    title: "Academic Policy on Generative AI at Mapúa University",
    category: "AI Policy",
    summary: "Institutional stance and ethical framework on generative AI usage in teaching, learning, assessment, and research.",
    keyPoints: [
      "Ethical Framework: Guided by Aristotle's 'Golden Mean' ('Nothing in excess') and compliant with RA 10173 (Data Privacy Act of 2012).",
      "Endorsed AI for Students: Adaptive learning tools, virtual assistant chatbots (like Noodle Factory / Walter AI), self-reflective evaluation, and intelligent guided learning.",
      "Endorsed AI for Faculty: Syllabus design, intelligent scheduling, automated preliminary rubric grading, student progress analytics, and formative content generation.",
      "Mandatory Transparency & Attribution: Students must provide reproducible attribution (date accessed, tool/URL used, and exact prompt) for AI-assisted coursework when permitted by instructor.",
      "Research Rules: Large language models (LLMs) cannot be credited as authors; researchers must verify facts, guard against hallucinations, and disclose all AI usage.",
      "Academic Integrity: Using unpermitted AI or claiming AI work as original is punishable under the Academic Integrity Policy."
    ],
    referenceText: `Section III: ACADEMIC POLICY ON GENERATIVE AI AT MAPUA UNIVERSITY
• Philosophy: Guided by Aristotle's "Golden Mean" and "Nothing in excess" to embrace educational technologies while mitigating risks.
• Guiding Principles: Achieving educational goals, broad forms of assessment, workload efficiency, equity, learner autonomy, privacy (RA 10173), human transparency/accountability, and informed participation.
• Student Guidelines: Inquire about specific course-level AI policies during orientation. AI must support learning, not replace intellectual rigor. Always provide reproducible attribution when AI tools are permitted.
• Faculty Guidelines: Be upfront in course syllabus regarding permitted and prohibited AI tools. Provide sample course AI statements (prohibitive, controlled with attribution, or exploratory in design).
• Researcher Accountability: Researchers are solely accountable for originality and integrity; verify against hallucinations; list AI tools in acknowledgments/methods; AI cannot be listed as an author.`,
    samplePrompt: "Explain the official Mapúa Academic Policy on Generative AI (A.Y. 2026-2027), including required attribution and student guidelines."
  },
  {
    id: "grading-system",
    part: "PART B: ACADEMIC POLICIES",
    sectionNumber: "Section IV, Item 7",
    title: "Grading System & Grade Equivalencies",
    category: "Grading & Honors",
    summary: "Official numerical scale, letter grades, passing thresholds (70% and 80%), and non-numeric marks.",
    keyPoints: [
      "1.00 (A): 98–100% (Excellent)",
      "1.25 (A-): 95–97.99% / 96–97.99% (Highly Meritorious)",
      "1.50 (B+): 91–94.99% / 94–95.99% (Meritorious)",
      "1.75 (B): 88–90.99% / 92–93.99% (Very Good)",
      "2.00 (B-): 85–87.99% / 90–91.99% (Good)",
      "2.25 (C+): 81–84.99% / 88–89.99% (Satisfactory)",
      "2.50 (C): 77–80.99% / 86–87.99% (Fair)",
      "2.75 (D+): 73–76.77% / 83–85.99% (Marginal)",
      "3.00 (D): 70–72.99% / 80–82.99% (Lowest Passing Grade)",
      "5.00 (F): 0–69.99% / 0–79.99% (Failure)",
      "Non-numeric: ABS (Failure due to absences >=20%), C (Continuing for thesis), I (Incomplete), W (Official Withdrawal), IP (In Progress - UOx), P (Passed), F (Failed)."
    ],
    referenceText: `Section IV, Item 7: GRADING SYSTEM
• Grade of 5.00: Poor performance, dropping without official withdrawal, accumulating 20% absences in a term, failing to submit >50% of assessments, or Academic Integrity violations.
• Incomplete Grade ('I'): Given for justifiable missed final exams with passing standing. Must be completed within the next two (2) terms using Request to Complete Course Form (FM-RO-19) and Completion Report Form (FM-RO-20). If not completed, it automatically lapses to 5.00.
• Grade of 'W': Official withdrawal filed on or before Friday of the 6th week via FM-RO-21-02. Allowed maximum of two (2) withdrawals on the same course. Cannot be removed or completed.`,
    samplePrompt: "What are the passing grade equivalencies and the rules for Incomplete ('I') and Withdrawal ('W') in Mapúa?"
  },
  {
    id: "academic-honors-scholarships",
    part: "PART B: ACADEMIC POLICIES",
    sectionNumber: "Section IV, Items 8 & 9",
    title: "Scholarships, Dean's List, President's List & Latin Honors",
    category: "Grading & Honors",
    summary: "Criteria for quarterly Dean's List, President's List tuition discounts, and Baccalaureate Latin Honors.",
    keyPoints: [
      "President's List Scholarship: QWA 1.00 to 1.50 = 100% full tuition discount; QWA 1.51 to 1.75 = 50% half tuition discount for the succeeding term.",
      "Dean's List Criteria: QWA of 1.00 to 1.75, running GWA of 1.00 to 2.00, enrolled in >=12 units, no grade of F, 5.00, ABS, IP, C, I, or W, and no prior academic dismissal.",
      "Latin Honors: Summa Cum Laude (GWA 1.00 to 1.20), Magna Cum Laude (GWA 1.21 to 1.45), Cum Laude (GWA 1.46 to 1.75).",
      "Baccalaureate Medals: Don Tomas Mapúa Gold Medal (Highest GWA >= 2.00 in Engineering, ARIDBE, SOIT), President Oscar B. Mapúa Silver Medal (2nd Highest GWA >= 2.00).",
      "Residency requirement for honors: Completed minimum 75% of degree units in Mapúa with residency time not exceeding regular terms + 1 term."
    ],
    referenceText: `Section IV, Items 8 & 9: ACADEMIC SCHOLARSHIPS & HONORS
• President's List: Top spots per program batch qualify for 100% (QWA 1.00-1.50) or 50% (QWA 1.51-1.75) tuition discount. Must coordinate with CSFA to sign undertaking.
• Grade Inconsistency: Grade corrections must be encoded within 1 week of grade release before list generation.
• Latin Honors: Minimum 75% units in Mapúa, no failing grade/IP in any course (including PE & NSTP), no disciplinary record, within residency limit.`,
    samplePrompt: "What are the requirements for Dean's List, President's List scholarship discounts, and Latin Honors at Mapúa?"
  },
  {
    id: "attendance-absences",
    part: "PART B: ACADEMIC POLICIES",
    sectionNumber: "Section IV, Item 3",
    title: "Attendance Policies & The 20% Absence Rule",
    category: "Academics",
    summary: "Attendance requirements and automatic failure rules per CHED and Mapúa regulations.",
    keyPoints: [
      "20% Absence Rule: Accumulating absences equivalent to 20% of the prescribed school days in one term results in an automatic final grade of 5.00 (FAILURE) or ABS.",
      "1 Unit Course: 2 absences allowed maximum.",
      "2 Unit Course: 4 absences allowed maximum.",
      "3 Unit Course: 7 absences allowed maximum.",
      "4 Unit Course: 9 absences allowed maximum.",
      "5 Unit Course: 11 absences allowed maximum.",
      "Written explanation required for all absences; excused absences do not exempt students from fulfilling required assessments."
    ],
    referenceText: `Section IV, Item 3: POLICIES ON ATTENDANCE
• 3.1: No credit given unless enrolled and attending regularly.
• 3.2: Based on CHED ruling, 20% absence threshold triggers automatic grade 5.00 (FAILURE).
• 3.3: Student must present written explanation to instructors. Does not relieve student from compliance with course requirements.`,
    samplePrompt: "How many absences are allowed in a 3-unit course in Mapúa before getting an automatic 5.00?"
  },
  {
    id: "course-load-overload",
    part: "PART B: ACADEMIC POLICIES",
    sectionNumber: "Section IV, Items 1 & 2",
    title: "Course Load, Overload, & Prerequisites",
    category: "Academics",
    summary: "Full-time definition, maximum allowable units, overload petition criteria, and prerequisite waiver rules.",
    keyPoints: [
      "Full-Time Student: Carries prescribed curriculum load of not less than 15 units (or graduating student with remaining units).",
      "Part-Time Student: Carries load below 9 units.",
      "Maximum Load: Up to 21 units as prescribed in curriculum.",
      "Overload for Good Academic Standing: Dean/Chair can allow maximum 3 units overload.",
      "Graduating/Exchange Overload: Up to 4 units overload for the last two terms if remaining load is 34 units or less.",
      "Prerequisite Waiver: Graduating students with 34 units or less remaining may apply to waive prerequisites and take prerequisite and advanced courses simultaneously.",
      "Paired Courses: Lecture and Laboratory/Field/Drafting (LFD) tagged with 'P' must be taken simultaneously."
    ],
    referenceText: `Section IV, Items 1.1-1.13: COURSE LOAD & PREREQUISITES
• Maximum standard course load: 21 units.
• Overload: Up to 3 units for Good Standing; up to 4 units for graduating students in their final two terms with <=34 units remaining.
• Prerequisite Waivers: Strict sequential prerequisite rules, except for graduating students with <=34 units remaining who may take prerequisite and advanced courses concurrently upon Dean approval.`,
    samplePrompt: "What are the rules for filing an overload or prerequisite waiver petition in Mapúa?"
  },
  {
    id: "academic-status-retention",
    part: "PART B: ACADEMIC POLICIES",
    sectionNumber: "Section IV, Item 11",
    title: "Academic Status, Retention & Program Dismissal",
    category: "Academics",
    summary: "Quarterly review of academic standing, Academic Warning, Probation, and Program Dismissal criteria.",
    keyPoints: [
      "Academic Good Standing: Quarterly Weighted Average (QWA) between 1.00 and 3.50.",
      "Academic Warning Status: QWA between 3.51 and 4.50 (1st occurrence).",
      "Academic Probationary Status: QWA between 3.51 and 4.50 for the 2nd time.",
      "Academic Final Probationary Status: QWA between 3.51 and 4.50 on the 3rd time (or QWA 4.51-5.00). Max load capped at 12 units.",
      "Licensure Programs Dismissal: Failing any professional course or same math/science course for the 3rd time places student on Final Probation; 4th time results in PROGRAM DISMISSAL.",
      "Academic Status Reset: Shifting to a non-licensure program grants an Academic Status reset."
    ],
    referenceText: `Section IV, Item 11: REVIEW OF ACADEMIC STATUS / RETENTION
• Academic reviews conducted at the end of each curriculum quarter.
• Final Probationary status limits student to maximum 12 units.
• In licensure programs, 4th failure in a professional course or math/science leads to Program Dismissal without readmission to that program group.`,
    samplePrompt: "Explain Mapúa's academic retention rules, academic probation, and program dismissal conditions."
  },
  {
    id: "program-shifting",
    part: "PART B: ACADEMIC POLICIES",
    sectionNumber: "Section IV, Item 12",
    title: "Policies and Guidelines for Shifting",
    category: "Admissions & Shifting",
    summary: "Procedures, GPA requirements, and modality shifting policies across Engineering, Sciences, Business, and Arts.",
    keyPoints: [
      "Licensure Programs (Engineering/Sciences): Cumulative average of 2.50 or better with no record of failure; Math (up to Integral Calculus), Physics, and Chemistry weighted average must be 2.50 or better.",
      "Health Sciences & Accountancy: Cumulative average of 2.50 or better with no record of failure.",
      "AR/INT (Architecture/Interior Design): Cumulative average 2.50+, drawing courses weighted average 2.00+, math/physics 3.00+.",
      "Arts & SoMDA: Submission of creative works portfolio related to degree program.",
      "Modality Shifting (Blended <-> UOx): Shifting to another modality is allowed ONCE ONLY.",
      "Procedure: Fill out Program Shifting Request Form, secure current Dean notation, submit to accepting Dean for evaluation/interview, submit to Registrar within 3 days, and settle Treasury fee."
    ],
    referenceText: `Section IV, Item 12: POLICIES AND GUIDELINES FOR SHIFTING
• Shifting between programs allowed multiple times provided accepting program criteria are met.
• Modality shifting (UOx online to Blended or vice versa) permitted only once.
• Step-by-step 11-step shifting procedure managed through Office of the Registrar and Deans' offices.`,
    samplePrompt: "What are the requirements and procedure for shifting programs or switching modalities in Mapúa?"
  },
  {
    id: "idl-uox-digital-learning",
    part: "PART C: INSTITUTE FOR DIGITAL LEARNING",
    sectionNumber: "Items 1 to 5",
    title: "Institute for Digital Learning & UOx Online Programs",
    category: "Academics",
    summary: "Structure of Ubiquitous Online Experience (UOx), modular course delivery, and grading model.",
    keyPoints: [
      "UOx Degree Programs: 100% online BS CpE, EE, ECE, IE, CS, IT, Data Science, BA Business Administration, and Multimedia Arts.",
      "Modularization: Number of learning modules matches academic units (3-unit course = 3 modules distributed across 11 weeks: Weeks 1-4, 5-8, 9-11).",
      "Whole-Course Grading Model: Cumulative single final grade on Transcript of Records, not per-module credit.",
      "Two Delivery Modes: (1) Fully Online Self-Paced (Tier 1-2 General Education, Math, Science) and (2) Fully Online Instructor-Facilitated (Tier 3-4 Major & Terminal courses).",
      "Life Coaching: Designated UOx Life Coaches provide adjustment support and monitor student progression.",
      "Incomplete Grade ('I'): Max 2-term extension period to resolve before defaulting to 5.00."
    ],
    referenceText: `PART C: INSTITUTE FOR DIGITAL LEARNING (IDL & UOx)
• Mission: Directing Mapúa's ubiquitous digital online learning initiatives.
• Degree equivalence: Credentials from UOx programs carry identical academic weight as classroom-based programs.
• Whole-Course Grading: Cumulative grading schema matching blended equivalents with Incomplete ("I") resolution window of 2 terms.`,
    samplePrompt: "How does the Mapúa UOx fully online modular learning system and grading work?"
  },
  {
    id: "student-discipline-opd",
    part: "PART F: STUDENT AFFAIRS",
    sectionNumber: "Section III",
    title: "Office of the Prefect of Discipline (OPD) & Code of Conduct",
    category: "Student Life & Discipline",
    summary: "Minor and major disciplinary offenses, community service hours, anti-bullying, anti-hazing, and Safe Space Act.",
    keyPoints: [
      "Minor Offenses: 1st Offense = Warning, 2nd Offense = 3 hours community service, 3rd Offense = 6 hours community service, 4 minor offenses in 1 quarter = Major Offense.",
      "Key Minor Offenses: Wearing improper attire, not wearing ID, loitering during class, eating/drinking in prohibited areas, vape/e-cigarette possession, disruptive phone use.",
      "Major Offenses: Cheating (1.1-1.11), falsification (2.1-2.5), ID lending/borrowing, physical assault, cyberbullying/bullying (RA 10627), hazing (RA 11053), illegal drugs (RA 9165), gender-based sexual harassment (RA 11313 Safe Space Act).",
      "Academic Dishonesty Sanction: Outright modular grade of 5.00 / F regardless of standing + disciplinary proceedings.",
      "Committee on Decorum and Investigation (CDI): Evaluates serious major cases."
    ],
    referenceText: `Section III: OFFICE OF THE PREFECT OF DISCIPLINE (OPD)
• Minor Offenses: 19 enumerated infractions with progressive community service sanctions. Accumulating 4 minor offenses within 1 quarter constitutes a major offense.
• Major Offenses: 35 policies with sanctions ranging from suspension of 1 term or more to dismissal and expulsion.
• Compliance with National Laws: Republic Act No. 10627 (Anti-Bullying), Republic Act No. 11053 (Anti-Hazing Act of 2018), Republic Act No. 11313 (Safe Space Act), and RA 9165 (Comprehensive Dangerous Drugs Act).`,
    samplePrompt: "What are the minor and major student offenses and sanctions under the Mapúa Office of the Prefect of Discipline (OPD)?"
  },
  {
    id: "library-services-hours",
    part: "PART G: STUDENT SERVICES AND FACILITIES",
    sectionNumber: "Section I",
    title: "Mapúa Library Services, Facilities & Loan Policies",
    category: "Services & Facilities",
    summary: "Library schedules, study zones, borrowing limits, fines, and digital resource databases.",
    keyPoints: [
      "Operating Hours: Main Library (Intramuros) & Makati: Mon–Fri 7:00 AM – 9:00 PM, Sat 7:00 AM – 5:00 PM. STHM Library: Mon–Fri 8:00 AM – 5:00 PM.",
      "Study Zones: Quiet Study Zones (Reference, Periodicals, AR Library) vs Collaborative Study Zones (group study & discussion rooms).",
      "Book a Space: Reserve discussion rooms (4-8 pax capacity) via library.mapua.edu.ph at least 1 hour in advance (usage: 15 mins to 2 hours).",
      "Library of Things: Borrow non-traditional tools including tablets, calculators, ring lights, projectors, DSLRs, and laptops.",
      "Circulation Loans: Filipiniana/Circulation = 1 week (limit 3 books, fine PHP 10.00/day); Fiction = 2 weeks (limit 3 books, fine PHP 10.00/day); Reserve Books = Overnight due 10:00 AM next day (fine PHP 20.00/day); General Reference = Day loan (fine PHP 10.00/hour).",
      "Digital Databases: IEEE Xplore, ScienceDirect, Scopus, Web of Science, EBSCO, Turnitin, Turnitin Draft Coach, Mendeley Institutional Edition."
    ],
    referenceText: `PART G, Section I: MAPUA LIBRARY
• Access via valid Mapúa ID or e-CM.
• Branch Libraries: Main Library Intramuros (2nd Flr West Bldg), Architecture Library (4th Flr South Bldg), Makati Library (3rd Flr), STHM Library.
• Online Services: Ex Libris Primo search portal, remote proxy access via Office 365 login, Document Delivery Service, Interlibrary Loans across Mapúa libraries.`,
    samplePrompt: "What are the Mapúa Library hours, study room reservation rules, and book borrowing loan periods and overdue fines?"
  },
  {
    id: "ilmo-laboratories",
    part: "PART G: STUDENT SERVICES AND FACILITIES",
    sectionNumber: "Section II",
    title: "Institutional Laboratory Management Office (ILMO) Rules",
    category: "Services & Facilities",
    summary: "Laboratory safety guidelines, reservation protocols for thesis/capstone, and PPE requirements.",
    keyPoints: [
      "Location: Intramuros (2nd Floor North Bldg beside N206), Makati (beside MPO224).",
      "Safety Dress Code: Shorts, sleeveless tops, and open shoes are strictly prohibited in all laboratory facilities with chemical, electrical, or mechanical hazards.",
      "Mandatory PPE: Personal Protective Equipment (lab coats, safety goggles, gloves) required as prescribed by lab type.",
      "Reservation for Capstone/Research: Submit accomplished laboratory reservation form to ILMO at least three (3) working days prior to scheduled activity.",
      "No food or drinks permitted inside any laboratory room."
    ],
    referenceText: `PART G, Section II: INSTITUTIONAL LABORATORY MANAGEMENT OFFICE (ILMO)
• Centralized management of specialized laboratories across AR-ID-BE, CBMES, CEGE, EECE, FES, IE-EMG, MME, SHS, Health Sciences, Medicine, and Nursing.
• Students must be accompanied by faculty/adviser or lab personnel.
• Chemical waste and concrete debris disposal must be coordinated with ILMO.`,
    samplePrompt: "What are the laboratory safety rules and reservation procedures under Mapúa ILMO?"
  },
  {
    id: "doit-mymapua-cardinal-plus",
    part: "PART G: STUDENT SERVICES AND FACILITIES",
    sectionNumber: "Section III",
    title: "Development Office for Information Technology (DO-IT) & Portals",
    category: "Services & Facilities",
    summary: "MyMapua portal features, Cardinal Plus Smart ID, 1 Gbps redundant bandwidth, Office 365, and computer lab guidelines.",
    keyPoints: [
      "MyMapua Portal (https://my.mapua.edu.ph): View grades, curriculum roadmap, class schedules, and online tuition/matriculation payment.",
      "Cardinal Plus Smart ID: Contactless smart ID card and ATM card powered by RCBC MyWallet.",
      "Lost ID Process: Obtain Affidavit of Loss > get clearance from OPD/CSAD > submit to DO-IT > pay ID replacement fee > photo/signature retaken > ID claimed within the day.",
      "Campus Connectivity: Sustains 1 Gbps internet bandwidth with dual ISP redundancy and DOST-ASTI PHopenIX connection across Intramuros and Makati.",
      "Office 365 Education: Free institutional Office 365 accounts (myMail, Word, Excel, PowerPoint, OneNote, OneDrive cloud storage, SharePoint).",
      "Computer Labs: Entry only with instructor present; USB devices prohibited (use OneDrive/SharePoint); no games, food, or unauthorized software."
    ],
    referenceText: `PART G, Section III: DO-IT SERVICES & POLICIES
• Manages institutional IT infrastructure, Parent Portal, LMS (Cardinal Edge), and Campus-wide Wi-Fi.
• Computer Lab Safety: Report hardware faults immediately; strictly no altering BIOS/OS; vandalism and unauthorized peripherals prohibited.`,
    samplePrompt: "What services does DO-IT offer and what is the step-by-step process for replacing a lost Mapúa Cardinal Plus ID?"
  },
  {
    id: "ilift-microcredentials",
    part: "PART E: INNOVATION FOR LIFELONG LEARNING (iLIFT)",
    sectionNumber: "Sections I & II",
    title: "iLIFT, Microcredentials & Professional Academies",
    category: "Academics",
    summary: "Curriculum Integrated Programs (CIP), Cisco & CompTIA academies, Microcredentials, and Pearson VUE / Certiport test centers.",
    keyPoints: [
      "Three Core Pillars: Lifelong Learning Education, Internationalization, and Career Advancement.",
      "Microcredential Program: Intensive short courses (8 to 40 hours) credited toward Master of Science (MS), Master of Engineering (MEng), and Master in Information Technology (MIT) valid for 2 years.",
      "Curriculum Integrated Programs (CIP): Embedded certifications within degree curricula (Cisco Networking Academy, CompTIA Academy).",
      "Specialized Academies: Project Management Academy, Cybersecurity Academy, Design for Manufacture and Assembly (DFMA) Academy, Language Academy (Japanese, Korean, Spanish, French, Mandarin, Filipino).",
      "Testing Services: Pearson VUE and Certiport Authorized Testing Centers located at Mapúa Intramuros."
    ],
    referenceText: `PART E: INNOVATION FOR LIFELONG LEARNING, INTERNATIONALIZATION & FUTURE TALENT (iLIFT)
• Bridges degree education with globally recognized industry certifications.
• Career Advancement & Placements: On-the-Job Training (OJT), International OJT (iOJT), Career Expo job fairs, and Career Springboard.`,
    samplePrompt: "What are Mapúa iLIFT microcredentials and which industry certification academies are offered?"
  },
  {
    id: "history-vision-values",
    part: "PART A: INTRODUCTION",
    sectionNumber: "Sections I & II",
    title: "Mapúa Vision, Mission, Core Values (DECIR) & History",
    category: "History & Identity",
    summary: "Centennial legacy, founder Don Tomas Mapúa, DECIR core values, and global recognitions.",
    keyPoints: [
      "Founded: 1925 by Don Tomas Mapúa, Cornell University architecture graduate and 1st registered architect of the Philippines.",
      "Vision: 'Mapúa University, a global leader in education, fosters socio-economic growth in society through innovation, digital transformation, and lifelong education.'",
      "Mission: Provide globally competitive learning environments, engage in viable research and innovation, and deliver state-of-the-art solutions to industry and communities.",
      "Core Values (DECIR): Discipline, Excellence, Commitment, Integrity, Relevance.",
      "Key Milestones: 1st private school to offer EE and ME (1940s), 1st school in SE Asia with electronic digital computer IBM 650 (1963), Quarterm system pioneer (2002), 1st in SE Asia with ABET accreditation (2010), University status granted by CHED (2017), Times Higher Education (THE) World University Rankings Top 1501+."
    ],
    referenceText: `PART A: INTRODUCTION & HISTORY OF MAPUA UNIVERSITY
• Core Values: Discipline, Excellence, Commitment, Integrity, Relevance (DECIR) alongside YGC Core Values (Passion for Excellence, Sense of Urgency, Professional Discipline, Teamwork, Loyalty).
• Campuses: Intramuros (658 Muralla St.), Makati (1191 Pablo Ocampo Sr. Ext.), and Ayala Malls Manila Bay (STHM).`,
    samplePrompt: "What is the history of Mapúa University and what are its DECIR core values and mission?"
  }
];
