// Career Progression Data from the Excel Sheet

export interface SkillLevel {
  name: string;
  description: string;
  skills: string[];
}

export interface Skill {
  name: string;
  fullName: string;
  description: string;
  levels: {
    standard: SkillLevel;
    effective: SkillLevel;
    advanced: SkillLevel;
    expert: SkillLevel;
  };
}

export interface CareerTrack {
  id: string;
  name: string;
  description: string;
  levels: number[];
}

export interface ProgressionLevel {
  level: number;
  name: string;
  description: string;
  availableIn: string[];
  requiredProficiency: string;
}

// Proficiency Definitions
export const proficiencyDefinitions = {
  developing: {
    name: "Developing",
    frequency: "Sometimes (less than 50%)",
    description: "Learning and growing in this area"
  },
  ability: {
    name: "Ability",
    frequency: "Many times, but not always (more than 50%)",
    description: "Demonstrating capability regularly"
  },
  competent: {
    name: "Competent",
    frequency: "Almost always (more than 90%)",
    description: "Consistently performing at expected levels"
  },
  proficient: {
    name: "Proficient",
    frequency: "Always (100% or more)",
    description: "Mastery with consistent excellence"
  },
  expert: {
    name: "Expert",
    frequency: "Outstanding - consistently more than 100%",
    description: "Industry-leading performance"
  }
};

// Career Tracks
export const careerTracks: CareerTrack[] = [
  {
    id: "ic",
    name: "Individual Contributor (Business)",
    description: "Technical excellence and domain expertise – Business Teams",
    levels: [1, 2, 3, 4]
  },
  {
    id: "ic-enablement",
    name: "Individual Contributor (Enablement)",
    description: "Technical excellence and domain expertise – Enablement Teams",
    levels: [1, 2, 3, 4]
  },
  {
    id: "dept-lead",
    name: "Department Lead",
    description: "Leading specialized teams and functions",
    levels: [3, 4]
  },
  {
    id: "manager",
    name: "Manager",
    description: "People management and team leadership",
    levels: [4, 5]
  },
  {
    id: "group-manager",
    name: "Group Manager",
    description: "Strategic leadership across multiple teams",
    levels: [5, 6]
  }
];

// Progression Levels
export const progressionLevels: ProgressionLevel[] = [
  {
    level: 1,
    name: "Level 1",
    description: "Building core skills and understanding fundamentals",
    availableIn: ["IC", "IC Enablement"],
    requiredProficiency: "Standard proficiency across all skill areas"
  },
  {
    level: 2,
    name: "Level 2",
    description: "Growing expertise and taking on more responsibility",
    availableIn: ["IC", "IC Enablement"],
    requiredProficiency: "Effective proficiency in key skill areas"
  },
  {
    level: 3,
    name: "Level 3",
    description: "Demonstrating advanced capabilities and mentoring others",
    availableIn: ["IC", "IC Enablement", "Department Lead"],
    requiredProficiency: "Advanced/Effective proficiency depending on track"
  },
  {
    level: 4,
    name: "Level 4",
    description: "Leading initiatives and driving organizational impact",
    availableIn: ["IC", "IC Enablement", "Department Lead", "Manager"],
    requiredProficiency: "Expert/Advanced proficiency depending on track"
  },
  {
    level: 5,
    name: "Level 5",
    description: "Shaping company direction and building high-performing teams",
    availableIn: ["Manager", "Group Manager"],
    requiredProficiency: "Advanced to expert proficiency across all areas"
  },
  {
    level: 6,
    name: "Level 6",
    description: "Executive-level mastery and organizational stewardship",
    availableIn: ["Group Manager"],
    requiredProficiency: "Expert proficiency across all skill areas"
  }
];

// Skills with all level requirements
export const skills: Skill[] = [
  {
    name: "Domain Knowledge",
    fullName: "Domain Knowledge and its Application (Technical Ability)",
    description: "The depth of understanding and application of specialized knowledge, skills, and techniques related to a specific domain or field. This includes staying up-to-date with industry best practices, analyzing and solving complex problems, and leading innovation in the domain.",
    levels: {
      standard: {
        name: "Standard",
        description: "Standard level understanding",
        skills: [
          "Basic understanding of domain-specific concepts and terminology",
          "Ability to apply foundational knowledge in controlled, simple tasks",
          "Openness to learning and seeking knowledge within the domain"
        ]
      },
      effective: {
        name: "Effective",
        description: "Competent execution",
        skills: [
          "Competence in executing a broad range of domain-specific tasks with some complexity",
          "Ability to collaborate with peers on technical problems, providing and receiving insights",
          "Developing an understanding of how domain knowledge applies to real-world scenarios"
        ]
      },
      advanced: {
        name: "Advanced",
        description: "Proficient leadership",
        skills: [
          "Proficiency in applying domain knowledge to solve advanced, complex problems",
          "Ability to mentor others in domain-specific methodologies and practices",
          "Proficiency in identifying and implementing innovative solutions within the domain"
        ]
      },
      expert: {
        name: "Expert",
        description: "Mastery level",
        skills: [
          "Mastery of domain knowledge, recognized as an authority in the domain-related field and industry",
          "Ability to drive strategic initiatives, leveraging deep domain expertise",
          "Expertise in pioneering new methodologies, practices, or solutions within the domain"
        ]
      }
    }
  },
  {
    name: "Communication",
    fullName: "Communication (including Emotional Intelligence)",
    description: "The ability to effectively convey ideas, thoughts, and information to others through empathetic engagement, active listening, and adaptable communication styles tailored to diverse audiences. It prioritizes understanding and resonance, ultimately persuading and inspiring through empathetic connection and meaningful engagement.",
    levels: {
      standard: {
        name: "Standard",
        description: "Standard level understanding",
        skills: [
          "Understanding of basic communication principles and concepts",
          "Ability to convey ideas clearly with basic empathy",
          "Openness to feedback and willingness to improve communication skills"
        ]
      },
      effective: {
        name: "Effective",
        description: "Competent execution",
        skills: [
          "Competence in conveying ideas with empathy and active listening",
          "Ability to adapt communication style to different audiences",
          "Developing skills in conflict resolution and persuasive communication"
        ]
      },
      advanced: {
        name: "Advanced",
        description: "Proficient leadership",
        skills: [
          "Proficiency in leading emotionally intelligent communication efforts",
          "Ability to inspire and motivate through communication",
          "Proficiency in navigating complex communication challenges and conflicts"
        ]
      },
      expert: {
        name: "Expert",
        description: "Mastery level",
        skills: [
          "Mastery of emotionally intelligent communication principles and strategies",
          "Ability to influence organizational culture through communication",
          "Expertise in leveraging communication to drive organizational change and growth"
        ]
      }
    }
  },
  {
    name: "Planning",
    fullName: "Planning",
    description: "Planning proficiency involves crafting and executing strategies that optimize resources, task prioritization, and goal attainment. This entails preempting and addressing obstacles, orchestrating resource allocation effectively, and flexibly adapting to evolving circumstances.",
    levels: {
      standard: {
        name: "Standard",
        description: "Standard level understanding",
        skills: [
          "Understanding of fundamental planning concepts and terminology",
          "Ability to follow instructions and contribute to basic planning tasks",
          "Openness to learning and improving planning skills"
        ]
      },
      effective: {
        name: "Effective",
        description: "Competent execution",
        skills: [
          "Competence in creating and executing plans for routine tasks and projects",
          "Ability to identify and address potential planning issues",
          "Developing time management and prioritization skills"
        ]
      },
      advanced: {
        name: "Advanced",
        description: "Proficient leadership",
        skills: [
          "Proficiency in leading planning efforts independently",
          "Ability to develop strategic (directional) plans aligned with organizational goals",
          "Proficiency in risk management and contingency planning"
        ]
      },
      expert: {
        name: "Expert",
        description: "Mastery level",
        skills: [
          "Mastery of strategic planning principles and methodologies",
          "Ability to drive organizational change through strategic planning initiatives",
          "Expertise in aligning planning efforts with long-term organizational objectives"
        ]
      }
    }
  },
  {
    name: "Impactability",
    fullName: "Impactability",
    description: "The ability to make effective decisions with significant impact on a situation, organization, or individual, aligning with company goals. This includes considering multiple factors and options, taking calculated risks, with full ownership and accountability of work and decisions, creating visibility of one's work to all stakeholders, and ensuring the completion of tasks in line with role objectives.",
    levels: {
      standard: {
        name: "Standard",
        description: "Standard level understanding",
        skills: [
          "Understanding of basic principles of impact and effectiveness",
          "Ability to identify opportunities for positive impact in one's role",
          "Openness to feedback and willingness to improve impactability"
        ]
      },
      effective: {
        name: "Effective",
        description: "Competent execution",
        skills: [
          "Competence in identifying and creating a positive impact on work tasks and projects",
          "Ability to collaborate with others to maximize impact",
          "Developing skills in measuring and evaluating impact"
        ]
      },
      advanced: {
        name: "Advanced",
        description: "Proficient leadership",
        skills: [
          "Proficiency in leading impact-related initiatives within and beyond one's immediate role",
          "Ability to inspire and motivate others to maximize their impact",
          "Proficiency in measuring and evaluating impact across complex projects"
        ]
      },
      expert: {
        name: "Expert",
        description: "Mastery level",
        skills: [
          "Mastery of impactability principles and strategies, recognized as an authority in the field",
          "Ability to influence organizational strategy and decision-making through impact-focused approaches",
          "Expertise in leveraging impactability to drive organizational change and social innovation"
        ]
      }
    }
  },
  {
    name: "Solution Oriented",
    fullName: "Solution Oriented Mindset",
    description: "It proactively focuses on proposing workable solutions to achieve desired outcomes, emphasizing progress over dwelling on problems and encouraging creative thinking, collaboration, and resilience. This involves gathering and analyzing information to identify opportunities, critical relationships, and patterns among data in a given role.",
    levels: {
      standard: {
        name: "Standard",
        description: "Standard level understanding",
        skills: [
          "Understanding of basic problem-solving principles and concepts",
          "Ability to identify problems and propose simple solutions",
          "Openness to feedback and willingness to adopt a solution-oriented approach"
        ]
      },
      effective: {
        name: "Effective",
        description: "Competent execution",
        skills: [
          "Competence in identifying root causes of problems and proposing viable solutions",
          "Ability to collaborate with others to develop and implement solutions",
          "Developing skills in evaluating the effectiveness of solutions"
        ]
      },
      advanced: {
        name: "Advanced",
        description: "Proficient leadership",
        skills: [
          "Proficiency in leading solution-oriented initiatives beyond one's domain",
          "Ability to inspire and motivate others to adopt solution-focused approaches",
          "Proficiency in evaluating and refining solutions to maximize output"
        ]
      },
      expert: {
        name: "Expert",
        description: "Mastery level",
        skills: [
          "Mastery of solution-oriented thinking recognized as an authority in the field",
          "Ability to influence organizational strategy and decision-making through solution-focused approaches",
          "Expertise in driving organizational change and innovation through solution-oriented initiatives"
        ]
      }
    }
  },
  {
    name: "Company Culture",
    fullName: "Company Culture",
    description: "The ability to understand and align with the values, mindset, and policies of the organization. This includes seeking to understand professional cultural differences, promoting an inclusive work environment, exhibiting high-integrity behavior and consistently complying with company policies and procedures.",
    levels: {
      standard: {
        name: "Standard",
        description: "Standard level understanding",
        skills: [
          "Understanding of basic ethical principles and organizational values",
          "Ability to recognize ethical dilemmas and seek guidance when needed",
          "Openness to feedback and willingness to align actions with ethical standards"
        ]
      },
      effective: {
        name: "Effective",
        description: "Competent execution",
        skills: [
          "Competence in identifying ethical issues in work situations",
          "Ability to communicate ethical expectations and standards to others",
          "Developing skills in resolving ethical conflicts and dilemmas"
        ]
      },
      advanced: {
        name: "Advanced",
        description: "Proficient leadership",
        skills: [
          "Proficiency to inspire and motivate others to uphold ethical standards",
          "Ability to lead ethics-related initiatives across the organization",
          "Proficiency in conducting ethical risk assessments and developing mitigation strategies"
        ]
      },
      expert: {
        name: "Expert",
        description: "Mastery level",
        skills: [
          "Mastery of ethical principles and organizational values, recognized as an authority in the field",
          "Ability to influence organizational culture and strategy through ethical leadership",
          "Expertise in addressing ethical challenges and promoting integrity at all levels"
        ]
      }
    }
  },
  {
    name: "Leadership",
    fullName: "Leadership",
    description: "It is a dynamic process that centers on self-evolution and empowering teams, fostering a culture of continuous learning and setting an example through exemplary conduct. Create an enabling environment where creative solutions flourish, driving the efficient achievement of organizational objectives.",
    levels: {
      standard: {
        name: "Standard",
        description: "Standard level understanding",
        skills: [
          "Familiarity with fundamental leadership concepts",
          "Ability for continuous learning and self-development",
          "Developing skills towards the development of other team members"
        ]
      },
      effective: {
        name: "Effective",
        description: "Competent execution",
        skills: [
          "Competence in continuous learning and self-development",
          "Ability to influence small teams to build a culture of creativity and productivity",
          "Actively engage and contribute in leadership training and mentoring"
        ]
      },
      advanced: {
        name: "Advanced",
        description: "Proficient leadership",
        skills: [
          "Proficiency in self-development (Obsession for self-development)",
          "Competence in driving organizational change initiatives",
          "Proficiency in leading teams or projects without direct supervision",
          "Ability to create a culture of self-development and team development across the company"
        ]
      },
      expert: {
        name: "Expert",
        description: "Mastery level",
        skills: [
          "Mastery of strategic leadership and organizational development",
          "Expertise in cultivating leadership talent and fostering a leadership culture",
          "Competence to guide organizational strategy"
        ]
      }
    }
  }
];

/**
 * "Necessary requirements to progress to the next level" (from the Excel sheet).
 * These are the coachable, action-oriented behaviors per skill & proficiency.
 */
export const necessaryRequirementsBySkill: Record<
  string,
  Record<keyof Skill["levels"], string[]>
> = {
  "Domain Knowledge": {
    standard: [
      "Actively engage in learning opportunities within the domain, such as workshops and courses.",
      "Apply basic domain knowledge to a wider range of tasks with some variability.",
      "Seek feedback from peers and supervisors on domain-related work.",
    ],
    effective: [
      "Demonstrate effective problem-solving in complex domain-specific challenges.",
      "Take initiative in collaborative projects, leading technical discussions or components.",
      "Mentor peers in applying domain knowledge to enhance project outcomes.",
    ],
    advanced: [
      "Demonstrate effective problem-solving in complex domain-specific challenges.",
      "Take initiative in collaborative projects, leading technical discussions or components.",
      "Mentor peers in applying domain knowledge to enhance project outcomes.",
    ],
    expert: [
      "Continuously scan the horizon for emerging trends and technologies in the domain.",
      "Lead cross-functional teams in applying domain knowledge to strategic business initiatives.",
      "Develop and champion new methodologies or best practices to elevate organizational expertise.",
    ],
  },
  "Communication": {
    standard: [
      "Participate in communication activities under supervision.",
      "Practice active listening and empathy in communication.",
      "Seek feedback on communication style and incorporate improvements.",
    ],
    effective: [
      "Successfully engage in emotionally intelligent communication independently.",
      "Demonstrate leadership in fostering empathetic communication within teams.",
      "Mentor peers in developing emotionally intelligent communication skills.",
    ],
    advanced: [
      "Lead initiatives to embed emotionally intelligent communication in organizational culture.",
      "Drive communication strategies that foster collaboration and innovation.",
      "Mentor leaders in advanced communication and conflict resolution techniques.",
    ],
    expert: [
      "Lead communication initiatives at an organizational or industry level.",
      "Develop and implement innovative communication approaches.",
      "Influence industry standards and best practices in communication and emotional intelligence.",
    ],
  },
  "Planning": {
    standard: [
      "Participate in planning activities under supervision.",
      "Demonstrate proficiency in basic planning tasks.",
      "Seek opportunities to learn more about planning tools and methodologies.",
    ],
    effective: [
      "Successfully execute plans for complex tasks or projects.",
      "Demonstrate adaptability in planning approach to meet changing requirements.",
      "Mentor peers in effective planning and time management techniques.",
    ],
    advanced: [
      "Lead strategic planning initiatives, involving cross-functional teams.",
      "Drive process improvements in planning methodologies.",
      "Mentor others in advanced planning and risk management practices.",
    ],
    expert: [
      "Lead strategic planning efforts at an organizational or industry level.",
      "Develop and implement innovative planning approaches.",
      "Influence industry standards and best practices in strategic planning and execution.",
    ],
  },
  "Impactability": {
    standard: [
      "Participate in impact-related activities under supervision.",
      "Begin to implement strategies for creating a positive impact on work tasks.",
      "Seek feedback on impactability and incorporate improvements.",
    ],
    effective: [
      "Successfully create positive impact independently across various work domains.",
      "Demonstrate leadership in fostering a culture of impact within teams.",
      "Mentor peers in measuring and maximizing impact in their work.",
    ],
    advanced: [
      "Lead strategic initiatives to embed impactability into organizational culture.",
      "Drive impact strategies that align with organizational goals and values.",
      "Mentor leaders in advanced impact measurement and strategy development.",
    ],
    expert: [
      "Lead impact-related initiatives at an organizational or industry level.",
      "Develop and implement innovative impact approaches that drive sustainable change.",
      "Influence industry standards and best practices in impactability and social innovation.",
    ],
  },
  "Solution Oriented": {
    standard: [
      "Engage in problem-solving activities under supervision.",
      "Begin to apply solution-oriented thinking to work tasks and challenges.",
      "Seek feedback on problem-solving approach and incorporate improvements.",
    ],
    effective: [
      "Successfully implement solutions to complex problems independently.",
      "Demonstrate leadership in fostering a culture of solution-oriented thinking within teams.",
      "Mentor peers in effective problem-solving and solution implementation.",
    ],
    advanced: [
      "Lead strategic initiatives to embed a solution-oriented mindset into organizational culture.",
      "Drive solution strategies that align with organizational goals and values.",
      "Mentor leaders in advanced solution development and innovation practices.",
    ],
    expert: [
      "Lead solution-oriented initiatives at an organizational or industry level.",
      "Develop and implement innovative solution approaches that drive sustainable change.",
      "Influence industry standards and best practices in solution-oriented thinking and innovation.",
    ],
  },
  "Company Culture": {
    standard: [
      "Engage in ethical decision-making activities under supervision.",
      "Begin to apply ethical principles to work tasks and interactions.",
      "Seek opportunities to learn more about organizational ethics and values.",
    ],
    effective: [
      "Successfully navigates complex ethical situations independently.",
      "Demonstrate leadership in fostering a culture of ethics adherence within teams.",
      "Mentor or support peers in making ethical decisions and actions.",
    ],
    advanced: [
      "Lead strategic initiatives to embed a culture of ethics adherence into organizational DNA.",
      "Drive ethics strategies that align with organizational goals and values.",
      "Mentor others in advanced ethical decision-making and risk management.",
    ],
    expert: [
      "Lead ethics-related initiatives at an organizational or industry level.",
      "Develop and implement innovative approaches to promote ethics and integrity.",
      "Influence industry standards and best practices in ethics adherence and integrity.",
    ],
  },
  "Leadership": {
    standard: [
      "Engage in leadership training opportunities.",
      "Demonstrate leadership principles in supervised settings.",
      "Seek feedback on leadership approach and apply learnings.",
    ],
    effective: [
      "Drive diverse teams or projects successfully.",
      "Exhibit adaptability in leadership style to meet team needs.",
      "Mentor or support peers in their leadership development.",
    ],
    advanced: [
      "Develop and implement strategies for team and organizational improvement.",
      "Act as a mentor to emerging leaders, sharing insights and experiences.",
      "Contribute to thought leadership through internal or external channels.",
    ],
    expert: [
      "Continuously engage in advanced leadership development programs.",
      "Lead cross-functional teams in strategic initiatives.",
      "Influence the leadership development agenda at an organizational or industry level.",
    ],
  },
};

export function getNecessaryRequirements(
  skillName: string,
  requiredLevel: keyof Skill["levels"]
): string[] {
  return necessaryRequirementsBySkill[skillName]?.[requiredLevel] || [];
}

type RequiredSkill = { skillName: string; requiredLevel: keyof Skill["levels"] };

/**
 * Exact skill requirements per career track per level,
 * sourced directly from the Career Progression Definitions sheet.
 *
 * Skills order: Domain Knowledge | Communication | Planning |
 *               Impactability | Solution Oriented | Company Culture | Leadership
 */
export const trackLevelRequiredSkills: Record<string, Record<number, RequiredSkill[]>> = {
  // ── Business Teams – Individual Contributor ──────────────────────────────
  ic: {
    1: [
      { skillName: "Domain Knowledge",  requiredLevel: "standard"  },
      { skillName: "Communication",     requiredLevel: "standard"  },
      { skillName: "Planning",          requiredLevel: "standard"  },
      { skillName: "Impactability",     requiredLevel: "standard"  },
      { skillName: "Solution Oriented", requiredLevel: "standard"  },
      { skillName: "Company Culture",   requiredLevel: "standard"  },
      { skillName: "Leadership",        requiredLevel: "standard"  },
    ],
    2: [
      { skillName: "Domain Knowledge",  requiredLevel: "effective" },
      { skillName: "Communication",     requiredLevel: "effective" },
      { skillName: "Planning",          requiredLevel: "standard"  },
      { skillName: "Impactability",     requiredLevel: "standard"  },
      { skillName: "Solution Oriented", requiredLevel: "effective" },
      { skillName: "Company Culture",   requiredLevel: "standard"  },
      { skillName: "Leadership",        requiredLevel: "standard"  },
    ],
    3: [
      { skillName: "Domain Knowledge",  requiredLevel: "advanced"  },
      { skillName: "Communication",     requiredLevel: "effective" },
      { skillName: "Planning",          requiredLevel: "effective" },
      { skillName: "Impactability",     requiredLevel: "effective" },
      { skillName: "Solution Oriented", requiredLevel: "effective" },
      { skillName: "Company Culture",   requiredLevel: "standard"  },
      { skillName: "Leadership",        requiredLevel: "standard"  },
    ],
    4: [
      { skillName: "Domain Knowledge",  requiredLevel: "expert"    },
      { skillName: "Communication",     requiredLevel: "advanced"  },
      { skillName: "Planning",          requiredLevel: "effective" },
      { skillName: "Impactability",     requiredLevel: "advanced"  },
      { skillName: "Solution Oriented", requiredLevel: "effective" },
      { skillName: "Company Culture",   requiredLevel: "standard"  },
      { skillName: "Leadership",        requiredLevel: "effective" },
    ],
  },

  // ── Enablement Teams – Individual Contributor ────────────────────────────
  "ic-enablement": {
    1: [
      { skillName: "Domain Knowledge",  requiredLevel: "standard"  },
      { skillName: "Communication",     requiredLevel: "standard"  },
      { skillName: "Planning",          requiredLevel: "standard"  },
      { skillName: "Impactability",     requiredLevel: "standard"  },
      { skillName: "Solution Oriented", requiredLevel: "standard"  },
      { skillName: "Company Culture",   requiredLevel: "standard"  },
      { skillName: "Leadership",        requiredLevel: "standard"  },
    ],
    2: [
      { skillName: "Domain Knowledge",  requiredLevel: "effective" },
      { skillName: "Communication",     requiredLevel: "effective" },
      { skillName: "Planning",          requiredLevel: "standard"  },
      { skillName: "Impactability",     requiredLevel: "effective" }, // differs from Business IC
      { skillName: "Solution Oriented", requiredLevel: "standard"  }, // differs from Business IC
      { skillName: "Company Culture",   requiredLevel: "standard"  },
      { skillName: "Leadership",        requiredLevel: "standard"  },
    ],
    3: [
      { skillName: "Domain Knowledge",  requiredLevel: "advanced"  },
      { skillName: "Communication",     requiredLevel: "effective" },
      { skillName: "Planning",          requiredLevel: "effective" },
      { skillName: "Impactability",     requiredLevel: "effective" },
      { skillName: "Solution Oriented", requiredLevel: "effective" },
      { skillName: "Company Culture",   requiredLevel: "standard"  },
      { skillName: "Leadership",        requiredLevel: "standard"  },
    ],
    4: [
      { skillName: "Domain Knowledge",  requiredLevel: "expert"    },
      { skillName: "Communication",     requiredLevel: "advanced"  },
      { skillName: "Planning",          requiredLevel: "effective" },
      { skillName: "Impactability",     requiredLevel: "effective" }, // differs from Business IC (Advanced → Effective)
      { skillName: "Solution Oriented", requiredLevel: "effective" },
      { skillName: "Company Culture",   requiredLevel: "standard"  },
      { skillName: "Leadership",        requiredLevel: "effective" },
    ],
  },

  // ── Department Lead (same for Business & Enablement) ─────────────────────
  "dept-lead": {
    3: [
      { skillName: "Domain Knowledge",  requiredLevel: "effective" },
      { skillName: "Communication",     requiredLevel: "effective" },
      { skillName: "Planning",          requiredLevel: "effective" },
      { skillName: "Impactability",     requiredLevel: "effective" },
      { skillName: "Solution Oriented", requiredLevel: "effective" },
      { skillName: "Company Culture",   requiredLevel: "effective" },
      { skillName: "Leadership",        requiredLevel: "effective" },
    ],
    4: [
      { skillName: "Domain Knowledge",  requiredLevel: "advanced"  },
      { skillName: "Communication",     requiredLevel: "advanced"  },
      { skillName: "Planning",          requiredLevel: "effective" },
      { skillName: "Impactability",     requiredLevel: "effective" },
      { skillName: "Solution Oriented", requiredLevel: "advanced"  },
      { skillName: "Company Culture",   requiredLevel: "effective" },
      { skillName: "Leadership",        requiredLevel: "effective" },
    ],
  },

  // ── Manager (same for Business & Enablement) ─────────────────────────────
  manager: {
    4: [
      { skillName: "Domain Knowledge",  requiredLevel: "effective" },
      { skillName: "Communication",     requiredLevel: "advanced"  },
      { skillName: "Planning",          requiredLevel: "effective" },
      { skillName: "Impactability",     requiredLevel: "effective" },
      { skillName: "Solution Oriented", requiredLevel: "effective" },
      { skillName: "Company Culture",   requiredLevel: "advanced"  },
      { skillName: "Leadership",        requiredLevel: "effective" },
    ],
    5: [
      { skillName: "Domain Knowledge",  requiredLevel: "effective" },
      { skillName: "Communication",     requiredLevel: "advanced"  },
      { skillName: "Planning",          requiredLevel: "advanced"  },
      { skillName: "Impactability",     requiredLevel: "advanced"  },
      { skillName: "Solution Oriented", requiredLevel: "advanced"  },
      { skillName: "Company Culture",   requiredLevel: "advanced"  },
      { skillName: "Leadership",        requiredLevel: "advanced"  },
    ],
  },

  // ── Group Manager ─────────────────────────────────────────────────────────
  "group-manager": {
    5: [
      { skillName: "Domain Knowledge",  requiredLevel: "advanced"  },
      { skillName: "Communication",     requiredLevel: "advanced"  },
      { skillName: "Planning",          requiredLevel: "advanced"  },
      { skillName: "Impactability",     requiredLevel: "expert"    },
      { skillName: "Solution Oriented", requiredLevel: "expert"    },
      { skillName: "Company Culture",   requiredLevel: "advanced"  },
      { skillName: "Leadership",        requiredLevel: "advanced"  },
    ],
    6: [
      { skillName: "Domain Knowledge",  requiredLevel: "advanced"  },
      { skillName: "Communication",     requiredLevel: "expert"    },
      { skillName: "Planning",          requiredLevel: "expert"    },
      { skillName: "Impactability",     requiredLevel: "expert"    },
      { skillName: "Solution Oriented", requiredLevel: "expert"    },
      { skillName: "Company Culture",   requiredLevel: "expert"    },
      { skillName: "Leadership",        requiredLevel: "expert"    },
    ],
  },
};

/** Backward-compat alias – defaults to Business IC track */
export const levelRequiredSkills: Record<number, RequiredSkill[]> =
  trackLevelRequiredSkills["ic"] as Record<number, RequiredSkill[]>;

/**
 * Return the required-skills list for a given track + level.
 * Falls back in order:
 *   1. Requested track + level
 *   2. IC track + level (backward-compat)
 *   3. Any track that has data for the level (handles levels 5/6 which only
 *      exist in manager / group-manager tracks)
 */
export function getTrackLevelSkills(careerTrack: string, level: number): RequiredSkill[] {
  const trackData = trackLevelRequiredSkills[careerTrack];
  if (trackData?.[level]) return trackData[level];

  if (trackLevelRequiredSkills["ic"]?.[level]) return trackLevelRequiredSkills["ic"][level];

  // Canonical fallback order for higher levels
  const fallbackOrder = ["manager", "group-manager", "dept-lead", "ic-enablement"];
  for (const t of fallbackOrder) {
    if (trackLevelRequiredSkills[t]?.[level]) return trackLevelRequiredSkills[t][level];
  }
  return [];
}

/** Return the valid levels for a career track */
export function getTrackLevels(careerTrack: string): number[] {
  const track = careerTracks.find(t => t.id === careerTrack);
  return track?.levels || [1, 2, 3, 4];
}

// Get skills required for a specific level (track-aware)
export function getSkillsForLevel(
  level: number,
  careerTrack = "ic"
): { skill: Skill; requiredLevel: string }[] {
  const requirements = getTrackLevelSkills(careerTrack, level);
  return requirements.map(req => ({
    skill: skills.find(s => s.name === req.skillName)!,
    requiredLevel: req.requiredLevel
  })).filter(r => r.skill != null);
}

// Get skills that need to be upgraded when moving from currentLevel to targetLevel (track-aware)
export function getUpgradeRequirements(
  currentLevel: number,
  targetLevel: number,
  careerTrack = "ic"
): {
  skillName: string;
  skill: Skill;
  fromLevel: keyof Skill["levels"];
  toLevel: keyof Skill["levels"];
  needsUpgrade: boolean;
}[] {
  const currentReqs = getTrackLevelSkills(careerTrack, currentLevel);
  const targetReqs  = getTrackLevelSkills(careerTrack, targetLevel);

  return targetReqs.map(targetReq => {
    const currentReq = currentReqs.find(r => r.skillName === targetReq.skillName);
    const skillData  = skills.find(s => s.name === targetReq.skillName)!;
    const fromLevel  = (currentReq?.requiredLevel ?? "standard") as keyof Skill["levels"];
    const needsUpgrade = fromLevel !== targetReq.requiredLevel;
    return {
      skillName: targetReq.skillName,
      skill: skillData,
      fromLevel,
      toLevel: targetReq.requiredLevel,
      needsUpgrade,
    };
  }).filter(r => r.skill != null);
}

// Get the difference between two levels (track-aware)
export function getLevelProgression(
  currentLevel: number,
  targetLevel: number,
  careerTrack = "ic"
) {
  const currentSkills = getSkillsForLevel(currentLevel, careerTrack);
  const targetSkills  = getSkillsForLevel(targetLevel, careerTrack);

  return {
    current: currentSkills,
    target: targetSkills,
    improvements: targetSkills.map(({ skill, requiredLevel: targetReq }) => {
      const currentReq = currentSkills.find(s => s.skill.name === skill.name)?.requiredLevel ?? "standard";
      return {
        skill: skill.name,
        from: currentReq,
        to: targetReq,
        needsImprovement: currentReq !== targetReq
      };
    })
  };
}

// Full context for AI chatbot
export const careerDataContext = `
# Career Progression Framework

## Overview
This framework defines career progression across 4 career tracks (Individual Contributor, Department Lead, Manager, Group Manager) with 5 levels of advancement.

## Career Tracks
${careerTracks.map(t => `- ${t.name}: ${t.description} (Levels: ${t.levels.join(", ")})`).join("\n")}

## Progression Levels
${progressionLevels.map(l => `### ${l.name}
- Description: ${l.description}
- Available in: ${l.availableIn.join(", ")}
- Required: ${l.requiredProficiency}`).join("\n\n")}

## Proficiency Definitions
${Object.values(proficiencyDefinitions).map(p => `- ${p.name}: ${p.frequency} - ${p.description}`).join("\n")}

## Skills and Requirements

${skills.map(skill => `### ${skill.fullName}
${skill.description}

**Standard Level Requirements:**
${skill.levels.standard.skills.map(s => `- ${s}`).join("\n")}

**Effective Level Requirements:**
${skill.levels.effective.skills.map(s => `- ${s}`).join("\n")}

**Advanced Level Requirements:**
${skill.levels.advanced.skills.map(s => `- ${s}`).join("\n")}

**Expert Level Requirements:**
${skill.levels.expert.skills.map(s => `- ${s}`).join("\n")}`).join("\n\n")}

## Level-to-Skill Mapping (from Career Progression Definitions sheet)

### Individual Contributor – Business Teams
- Level 1: All skills Standard
- Level 2: Domain Knowledge(Effective), Communication(Effective), Solution Oriented(Effective); rest Standard
- Level 3: Domain Knowledge(Advanced), Communication/Planning/Impactability/Solution Oriented(Effective); rest Standard
- Level 4: Domain Knowledge(Expert), Communication(Advanced), Impactability(Advanced), Planning/Solution Oriented/Leadership(Effective); Company Culture Standard

### Individual Contributor – Enablement Teams
- Level 1: All skills Standard
- Level 2: Domain Knowledge/Communication/Impactability(Effective); rest Standard
- Level 3: Domain Knowledge(Advanced), Communication/Planning/Impactability/Solution Oriented(Effective); rest Standard
- Level 4: Domain Knowledge(Expert), Communication(Advanced), Planning/Impactability/Solution Oriented/Leadership(Effective); Company Culture Standard

### Department Lead
- Level 3: All 7 skills Effective
- Level 4: Domain Knowledge/Communication/Solution Oriented(Advanced); Planning/Impactability/Company Culture/Leadership(Effective)

### Manager
- Level 4: Communication/Company Culture(Advanced); rest Effective
- Level 5: Communication/Planning/Impactability/Solution Oriented/Company Culture/Leadership(Advanced); Domain Knowledge Effective

### Group Manager
- Level 5: Impactability/Solution Oriented(Expert); rest Advanced
- Level 6: Communication/Planning/Impactability/Solution Oriented/Company Culture/Leadership(Expert); Domain Knowledge Advanced
`;
