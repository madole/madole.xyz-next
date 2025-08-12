export interface ResumeData {
  aboutMe: {
    engineeringExperience: {
      startDate: string;
      hoursPerYear: number;
    };
    hobbies: {
      title: string;
      items: Array<{
        text: string;
        link?: {
          url: string;
          text: string;
        };
      }>;
    };
    socialMedia: {
      title: string;
      items: Array<{
        label: string;
        link: {
          url: string;
          text: string;
        };
      }>;
    };
    technologies: {
      title: string;
      categories: Array<{
        name: string;
        items: string[];
      }>;
    };
  };
  achievements: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
    image: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
    lightboxImage: {
      width: number;
      height: number;
    };
  }>;
  experience: Array<{
    period: string;
    title: string;
    company: string;
    logo?: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
    upgrades?: Array<{
      date: string;
      from: string;
      to: string;
    }>;
    duties?: string[];
    experience?: Array<{
      text: string;
      link?: {
        url: string;
        text: string;
      };
      subItems?: string[];
    }>;
    skills?: Array<{
      text: string;
      subItems?: string[];
    }>;
    notableProjects?: Array<{
      text: string;
    }>;
  }>;
  education: Array<{
    period: string;
    items: Array<{
      title: string;
      institution: string;
    }>;
  }>;
}

export const resumeData: ResumeData = {
  aboutMe: {
    engineeringExperience: {
      startDate: "2010-07-01",
      hoursPerYear: 2000,
    },
    hobbies: {
      title: "Hobbies and interests",
      items: [
        {
          text: "Samba drumming",
          link: {
            url: "https://www.youtube.com/watch?v=uSLcPmbKSxM",
            text: "Bateria 61",
          },
        },
        {
          text: "Photography",
          link: {
            url: "https://www.instagram.com/madoliole/",
            text: "Instagram",
          },
        },
        {
          text: "Blogging",
          link: {
            url: "https://madole.xyz/blog-index",
            text: "madole.xyz",
          },
        },
        {
          text: "Whiskey tasting",
        },
        { text: "Skateboarding" },
        { text: "Cycling" },
        { text: "Cooking" },
        { text: "Baking bread" },
        { text: "Cats" },
      ],
    },
    socialMedia: {
      title: "Social media",
      items: [
        {
          label: "Coding",
          link: {
            url: "https://github.com/madole",
            text: "Github",
          },
        },
        {
          label: "Thoughts",
          link: {
            url: "https://bsky.app/profile/madole.bsky.social",
            text: "Bluesky",
          },
        },
        {
          label: "Linkedin",
          link: {
            url: "https://www.linkedin.com/in/andrew-mcdowell-0092649b/",
            text: "Linkedin",
          },
        },
      ],
    },
    technologies: {
      title: "Technologies",
      categories: [
        {
          name: "Geospatial",
          items: [
            "Mapbox",
            "Maplibre",
            "Turf",
            "Leaflet",
            "Cesium JS",
            "Resium",
            "Geopandas",
            "GDAL",
            "QGIS",
            "ArcGIS Pro",
            "ArcGIS Online",
            "Geoserver",
            "WFS",
            "WMS",
            "Phoenix Fire Prediction Engine",
          ],
        },
        {
          name: "AI",
          items: [
            "Github Copilot",
            "Cursor",
            "Claude",
            "Gemini",
            "Grok",
            "Vertex AI",
            "AWS Bedrock",
            "AWS Sagemaker",
            "AWS Rekognition",
            "AWS Polly",
            "OpenAI Whisper",
            "Ollama",
            "MCP",
            "Agentic AI",
            "Mastra AI",
          ],
        },
        {
          name: "Frontend",
          items: [
            "Next",
            "SvelteKit",
            "React",
            "Mapbox",
            "Maplibre",
            "Turf",
            "NodeJS",
            "Bun",
            "Deno",
            "Leaflet",
            "Jest",
            "Vitest",
            "Webpack",
            "ESBuild",
            "Vite",
            "JS for embedded devices",
            "NPM",
            "Styled Components",
            "Cesium JS",
            "Tailwind CSS",
            "Gatsby",
          ],
        },
        {
          name: "BE ⸳ DevOps",
          items: [
            "AWS",
            "Step Functions",
            "Terraform",
            "Cloudformation",
            "Python",
            "Pandas/Geopandas",
            "NumPy",
            "Scikit-learn",
            "Tensorflow/DafanoJS",
          ],
        },
        {
          name: "Agile ⸳ Product",
          items: ["Jira", "Confluence", "Metabase", "Redash", "Intercom"],
        },
      ],
    },
  },
  achievements: [
    {
      id: "lightning",
      date: "MAR 2024",
      title: "Completed NASA ARSET training",
      description: "Introduction to Lightning Observations and Applications",
      image: {
        src: "/arset-introduction-to-lightning-observations.png",
        alt: "ARSET Introduction to Lightning Observations and Applications certificate",
        width: 250,
        height: 300,
      },
      lightboxImage: {
        width: 600,
        height: 800,
      },
    },
    {
      id: "spectral",
      date: "NOV 2023",
      title: "Completed NASA ARSET training",
      description: "Spectral Indices for Land and Aquatic Applications",
      image: {
        src: "/arset-spectral-indicies.png",
        alt: "ARSET Spectral Indicies certificate",
        width: 250,
        height: 300,
      },
      lightboxImage: {
        width: 600,
        height: 800,
      },
    },
    {
      id: "airquality",
      date: "OCT 2022",
      title: "Completed NASA ARSET training",
      description:
        "Accessing and Analyzing Air Quality Data from Geostationary Satellites",
      image: {
        src: "/arset-analyzing-air-quality-data.png",
        alt: "ARSET Accessing and Analyzing Air Quality Data from Geostationary Satellites certificate",
        width: 250,
        height: 300,
      },
      lightboxImage: {
        width: 600,
        height: 800,
      },
    },
  ],
  experience: [
    {
      period: "January 2021...",
      title: "Senior Geospatial & Frontend Technical Lead",
      company: "Kablamo",
      logo: {
        src: "/kablamo-logo.png",
        alt: "Kablamo logo",
        width: 100,
        height: 200,
      },
      upgrades: [
        {
          date: "January 2023",
          from: "",
          to: "Firestory Technical Director",
        },
        {
          date: "March 2022",
          from: "Tech Lead",
          to: "Senior Tech Lead",
        },
      ],
      duties: [
        "Host the fortnightly frontend catchup where we discuss emerging frontend technology and trends and showcase frontend work our team has achieved.",
        "Mentor frontend developers to reach their full potential",
        "Consult on the geospatial projects",
        "Build prototypes for client tenders",
        "Get developers excited about 3D visualisations and geospatial applications",
        "Build out and manage our geospatial knowledge base",
        "Architect and pitch solutions to clients during the sales cycle and development cycle",
        "Interview candidates for our frontend team",
        "Work with clients during engagements to make sure we're delivering on their needs",
      ],
      experience: [
        {
          text: "Led the technical integration of Firestory into ESRI's ArcGIS platform",
        },
        {
          text: "Worked with the Office of the NSW Chief Scientist to develop software for Forestry Corp to model Heavy Plant dry firefighting impact on bushfires through the",
          link: {
            url: "https://www.chiefscientist.nsw.gov.au/rd-action-plan/natural-hazards-technology-program",
            text: "Natural Hazards Technology Program",
          },
        },
        {
          text: "Led the team to deliver a predictive capability for FRNSW to help them forward plan for periods with increased incident risk.",
        },
        {
          text: "Architected and led the team delivering a Remote Fire Detection, Fire Prediction, Heavy Plant Response Planning and Fire Management capabilities for",
          link: {
            url: "https://firestory.io",
            text: "Firestory",
          },
          subItems: [
            "Event Driven",
            "Serverless",
            "Modular architecture",
            "NodeJS, Go, Typescript, React, Python",
          ],
        },
        {
          text: "Led the team to deliver an Automated Fireground Aviation Safety Assessment tool for NSW RFS which integrated BOM and Airservices Australia data. In the process, I became an SME on Aviation Weather Forecast data.",
        },
        {
          text: "Led the frontend team to deliver a 3D fire prediction tool for NSW RFS (Athena) using Mapbox and React.",
          link: {
            url: "https://www.kablamo.com.au/case-study/nsw-rural-fire-service",
            text: "NSW RFS Athena",
          },
        },
        {
          text: "Exhibited at AFAC 2023, 2024 and the 2024 Office of the NSW Chief Scientist & Engineer Commercialisation showcase",
        },
      ],
    },
    {
      period: "2016-December 2020",
      title: "Senior Software Engineer / (Engineering) Head of Visualiser",
      company: "Propeller Aero",
      duties: [
        "Build and maintain 3D drone mapping visualisation tool leveraging React, Redux and CesiumJS",
        "Build and maintain the backend service written in Koa serving both REST and GraphQL endpoints",
        "Mentor junior developers on software best practices and run workshops on the technologies and methodologies we use such as React, Redux, Node, Koa, Express, TDD.",
        "Scrum master for a small team of developers",
        "Write and maintain webpack and CI tooling and configuration to facilitate complex frontend builds",
        "Deliver software demos to the company to showcase work delivered",
        "Lead hiring interviews for Software Engineers, QA Engineers, Head of Engineering, Product Owners",
        "Facilitate regular team retros and feedback sessions",
        "Run One-to-Ones with the engineers",
        "Champion best practices and standards",
        "Visit customers to understand their needs and communicate back to the teams",
        "Translate technical concepts to non-technical stakeholders",
        "Build technical roadmaps and documentation to facilitate modernisation of an aging codebase",
        "Build feature usage dashboards so we can make informed data-driven decisions",
        "Write Infrastructure-as-Code using Terraform to generate the AWS cloud infrastructure to host our applications",
        "Architect simple solutions to complex problems with the team of engineers",
      ],
      skills: [
        { text: "Expert level React" },
        { text: "Expert level Node" },
        { text: "Strong mapping skills" },
        {
          text: "CesiumJS",
          subItems: ["CesiumJS", "Resium", "Leaflet", "Mapbox"],
        },
        { text: "Tech/Team Leading" },
        { text: "Developer Experience" },
        { text: "Agile ceremony facilitation" },
        { text: "OKR planning" },
        { text: "Mentoring" },
        { text: "Stakeholder management" },
      ],
    },
    {
      period: "2014-2016",
      title: "Senior Software Engineer",
      company: "Mi9/Channel 9",
      duties: [
        "Work as part of a scrum team to create and maintain the whole of Channel 9's network of websites",
        "Leading teams to deliver these websites",
        "Set the technical direction of the teams to ensure we're moving forward and taking advantage of best practices and new technology",
        "Helped deliver the first webpack built website in the network and help transition away from gulp and grunt",
        "Worked on the component library for Channel 9 to help share code across different codebases",
        "Pushed for React adoption within the company and lead the team building yourmovies.com.au in React",
      ],
    },
    {
      period: "2013-2014",
      title: "Software Engineer",
      company: "Pace International, Sydney office",
      duties: [
        "Work as part of a small remote team to deliver Foxtel iQ3 UI software written in HTML, CSS and JS",
        "Deliver software demos to customer stakeholders",
        "Work with other vendors to align on delivery and usage of APIs",
        "Work with set top box hardware to diagnose and solve issues",
      ],
    },
    {
      period: "2010-2013",
      title: "Software Engineer",
      company: "Asidua, Belfast",
      duties: [
        "Work as part of scrum teams on many projects across the business",
        "Work onsite with customer teams to deliver software projects",
        "Communicate progress with external stakeholders on behalf of the business",
      ],
      notableProjects: [
        {
          text: "Built a testing framework from scratch for set top box hardware in Perl + HTML/CSS/JS",
        },
        {
          text: "Rebuilt the BTVision set top box UI software with a focus on reducing memory footprint in JS",
        },
        {
          text: "Worked on high speed communications ordering tool for well known telecommunications company in Java + Angular JS",
        },
      ],
    },
  ],
  education: [
    {
      period: "2005-2010",
      items: [
        {
          title: "Bachelors of Engineering in Computer Science",
          institution: "Queens University Belfast",
        },
        {
          title: "Java Demonstrator",
          institution: "Queens University Belfast",
        },
        {
          title: "Database Administrator",
          institution: "Central Services Agency Northern Ireland",
        },
      ],
    },
  ],
};
