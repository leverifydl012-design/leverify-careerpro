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
    name: "Individual Contributor",
    description: "Technical excellence and domain expertise path",
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
    levels: [5]
  }
];

// Progression Levels
export const progressionLevels: ProgressionLevel[] = [
  {
    level: 1,
    name: "Level 1 - Foundation",
    description: "Building core skills and understanding fundamentals",
    availableIn: ["IC"],
    requiredProficiency: "Standard proficiency across all skill areas"
  },
  {
    level: 2,
    name: "Level 2 - Developing",
    description: "Growing expertise and taking on more responsibility",
    availableIn: ["IC"],
    requiredProficiency: "Effective proficiency in most skill areas"
  },
  {
    level: 3,
    name: "Level 3 - Skilled",
    description: "Demonstrating advanced capabilities and mentoring others",
    availableIn: ["IC", "Department Lead"],
    requiredProficiency: "Advanced proficiency in key skill areas"
  },
  {
    level: 4,
    name: "Level 4 - Expert",
    description: "Leading initiatives and driving organizational impact",
    availableIn: ["IC", "Department Lead", "Manager"],
    requiredProficiency: "Expert proficiency in multiple skill areas"
  },
  {
    level: 5,
    name: "Level 5 - Strategic Leader",
    description: "Shaping company direction and building high-performing teams",
    availableIn: ["Manager", "Group Manager"],
    requiredProficiency: "Mastery across all skill areas"
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
        description: "Foundation level understanding",
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
        description: "Foundation level understanding",
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
        description: "Foundation level understanding",
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
        description: "Foundation level understanding",
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
        description: "Foundation level understanding",
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
        description: "Foundation level understanding",
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
        description: "Foundation level understanding",
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

// Get skills required for a specific level
export function getSkillsForLevel(level: number): { skill: Skill; requiredLevel: string }[] {
  const levelMapping: { [key: number]: keyof Skill["levels"] } = {
    1: "standard",
    2: "effective",
    3: "effective",
    4: "advanced",
    5: "expert"
  };

  const requiredLevel = levelMapping[level] || "standard";
  
  return skills.map(skill => ({
    skill,
    requiredLevel
  }));
}

// Get the difference between two levels
export function getLevelProgression(currentLevel: number, targetLevel: number) {
  const currentSkills = getSkillsForLevel(currentLevel);
  const targetSkills = getSkillsForLevel(targetLevel);
  
  return {
    current: currentSkills,
    target: targetSkills,
    improvements: skills.map(skill => {
      const currentReq = currentSkills.find(s => s.skill.name === skill.name)?.requiredLevel;
      const targetReq = targetSkills.find(s => s.skill.name === skill.name)?.requiredLevel;
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

## Level-to-Skill Mapping
- Level 1: Standard proficiency across all skills
- Level 2: Effective proficiency in most skill areas
- Level 3: Effective to Advanced proficiency
- Level 4: Advanced proficiency in key areas
- Level 5: Expert proficiency across all areas
`;
