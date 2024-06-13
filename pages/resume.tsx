import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import FlexCenter from "../components/FlexCenter";
import Card, { Hr, Spacer } from "../components/resume/Card";
import CardDialog from "../components/resume/CardDialog";
import Column from "../components/resume/Column";
import Header from "../components/resume/Header";
import { differenceInCalendarYears } from "date-fns";

function getUrlSearchParam(searchParam: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(searchParam);
}

/**
 * Adding a future job to the resume via querystring
 *
 * We use the `q` attribute
 * We base64 encode a JSON object with the future job title (t) and company (c) with btoa
 *
 * @example
 * btoa('{"c": "NASA","t": "CEO"}')
 * //eyJjIjogIk5BU0EiLCJ0IjogIkNFTyJ9
 *
 * Querystring becomes
 * ?q=eyJjIjogIk5BU0EiLCJ0IjogIkNFTyJ9
 *
 */
function Resume(): JSX.Element {
  const [futureTitle, setFutureTitle] = useState("Technical Lead");
  const [futureCompany, setFutureCompany] = useState("");
  const [hobbiesOpen, setHobbiesOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [techOpen, setTechOpen] = useState(false);

  useEffect(() => {
    const q = getUrlSearchParam("q");
    if (!q) {
      return;
    }
    let future;
    try {
      const decoded = atob(q);
      future = JSON.parse(decoded);
    } catch (e) {
      console.error("Failed to parse q", e);
      return;
    }
    const title = future.t;

    if (title) {
      setFutureTitle(title);
    }
    const company = future.c;
    if (company) {
      setFutureCompany(company);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Resume | Madole.xyz</title>
      </Head>

      <div className="absolute inset-0 bg-trello-blue overflow-hidden animate-slowFadeIn">
        <Header />
        <div className="h-full flex overflow-x-scroll mx-2">
          <Column title="About me">
            <Card>
              <div className="pb-1 font-bold">Engineering Experience</div>
              <div>
                Approx{" "}
                {new Intl.NumberFormat().format(
                  differenceInCalendarYears(new Date(), new Date(2010, 6, 1)) *
                    2000,
                )}{" "}
                hours
              </div>
            </Card>
            <Card
              onClick={() => {
                setHobbiesOpen(true);
              }}
              labels={[{ text: "Clickable", color: "#61bd4f" }]}
            >
              Hobbies and interests
              <CardDialog
                open={hobbiesOpen}
                onClose={() => {
                  setHobbiesOpen(false);
                }}
                title="Hobbies and interests"
                columnName="About Me"
                date="6th Oct 2020 at 20:10"
              >
                <ul className="list-disc">
                  <li className="pb-2">
                    Samba drumming -{" "}
                    <a
                      className="text-blue-800 underline hover:text-blue-600"
                      href="https://www.youtube.com/watch?v=uSLcPmbKSxM"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      &nbsp;Bateria 61
                    </a>
                  </li>
                  <li className="pb-2">
                    Photography -
                    <a
                      className="text-blue-800 underline hover:text-blue-600"
                      href="https://www.instagram.com/madoliole/"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      &nbsp;The gram
                    </a>
                  </li>
                  <li className="pb-2">
                    Whiskey -{" "}
                    <a
                      className="text-blue-800 underline hover:text-blue-600"
                      href="https://www.whiskeynerds.com/"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      &nbsp;Whiskey Nerds
                    </a>
                  </li>
                  <li className="pb-2">Skateboarding</li>
                  <li className="pb-2">Baking sourdough bread</li>
                  <li className="pb-2">Cats</li>
                </ul>
              </CardDialog>
            </Card>
            <Card
              onClick={() => {
                setSocialOpen(true);
              }}
              labels={[{ text: "Clickable", color: "#61bd4f" }]}
            >
              Social media
              <CardDialog
                open={socialOpen}
                onClose={() => setSocialOpen(false)}
                title="Social media"
                columnName="About Me"
                date="6th Oct 2020 at 20:20"
              >
                <ul className="list-disc">
                  <li className="pb-2">
                    Coding - &nbsp;
                    <a
                      href={"https://github.com/madole"}
                      className="text-blue-800 underline hover:text-blue-600"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Github
                    </a>
                  </li>
                  <li className="pb-2">
                    Musings - &nbsp;
                    <a
                      href={"https://twitter.com/madole"}
                      className="text-blue-800 underline hover:text-blue-600"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Twitter
                    </a>
                  </li>
                  <li className="pb-2">
                    Lurking - &nbsp;
                    <a
                      href={
                        "https://www.linkedin.com/in/andrew-mcdowell-0092649b/"
                      }
                      className="text-blue-800 underline hover:text-blue-600"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Linkedin
                    </a>
                  </li>
                </ul>
              </CardDialog>
            </Card>
            <Card
              onClick={() => {
                setTechOpen(true);
              }}
              labels={[{ text: "Clickable", color: "#61bd4f" }]}
            >
              Technologies
              <CardDialog
                open={techOpen}
                onClose={() => setTechOpen(false)}
                title="Technologies"
                columnName="About Me"
                date="7th Oct 2020 at 20:20"
              >
                <div className="flex flex-col lg:flex-row justify-evenly w-full max-h-almost-full">
                  <div className="mb-4">
                    <div className="font-bold mb-4 text-xl -ml-5">Frontend</div>
                    <ul className="list-disc ">
                      <li className="pb-2">Next</li>
                      <li className="pb-2">SvelteKit</li>
                      <li className="pb-2">React</li>
                      <li className="pb-2">Mapbox</li>
                      <li className="pb-2">Maplibre</li>
                      <li className="pb-2">Turf</li>
                      <li className="pb-2">NodeJS</li>
                      <li className="pb-2">Bun</li>
                      <li className="pb-2">Deno</li>
                      <li className="pb-2">Leaflet</li>
                      <li className="pb-2">Jest</li>
                      <li className="pb-2">Vitest</li>
                      <li className="pb-2">Webpack</li>
                      <li className="pb-2">ESBuild</li>
                      <li className="pb-2">Vite</li>
                      <li className="pb-2">JS for embedded devices</li>
                      <li className="pb-2">NPM</li>
                      <li className="pb-2">Styled Components</li>
                      <li className="pb-2">Cesium JS</li>
                      <li className="pb-2">Tailwind CSS</li>
                      <li className="pb-2">Gatsby</li>
                    </ul>
                  </div>
                  <div className="mb-4">
                    <div className="font-bold mb-4 text-xl -ml-5">
                      BE ⸳ DevOps
                    </div>
                    <ul className="list-disc">
                      <li className="pb-2">AWS</li>
                      <li className="pb-2">Step Functions</li>
                      <li className="pb-2">Terraform</li>
                      <li className="pb-2">Cloudformation</li>
                      <li className="pb-2">Python</li>
                      <li className="pb-2">Pandas/Geopandas</li>
                      <li className="pb-2">NumPy</li>
                      <li className="pb-2">Scikit-learn</li>
                      <li className="pb-2">Tensorflow/DafanoJS</li>
                    </ul>
                  </div>
                  <div className="mb-4">
                    <div className="font-bold mb-4 text-xl -ml-5">
                      Agile ⸳ Product
                    </div>
                    <ul className="list-disc">
                      <li className="pb-2">Jira</li>
                      <li className="pb-2">Confluence</li>
                      <li className="pb-2">Metabase</li>
                      <li className="pb-2">Redash</li>
                      <li className="pb-2">Intercom</li>
                    </ul>
                  </div>
                </div>
              </CardDialog>
            </Card>
          </Column>
          <Column title="Achievements">
            <Card>
              <div className="pb-1 font-bold">
                MAR 2024: Completed NASA ARSET training
              </div>
              <div>Introduction to Lightning Observations and Applications</div>
              <FlexCenter>
                <Image
                  width={250}
                  height={300}
                  src="/arset-introduction-to-lightning-observations.png"
                  alt="ARSET Introduction to Lightning Observations and Applications certificate"
                  priority={true}
                />
              </FlexCenter>
            </Card>
            <Card>
              <div className="pb-1 font-bold">
                NOV 2023: Completed NASA ARSET training
              </div>
              <div>Spectral Indices for Land and Aquatic Applications</div>
              <FlexCenter>
                <Image
                  width={250}
                  height={300}
                  src="/arset-spectral-indicies.png"
                  alt="ARSET Spectral Indicies certificate"
                  priority={true}
                />
              </FlexCenter>
            </Card>
            <Card>
              <div className="pb-1 font-bold">
                OCT 2022: Completed NASA ARSET training
              </div>
              <div>
                Accessing and Analyzing Air Quality Data from Geostationary
                Satellites
              </div>
              <FlexCenter>
                <Image
                  width={250}
                  height={300}
                  src="/arset-analyzing-air-quality-data.png"
                  alt="ARSET Accessing and Analyzing Air Quality Data from Geostationary Satellites certificate"
                  priority={true}
                />
              </FlexCenter>
            </Card>
          </Column>
          {futureCompany && (
            <Column title="Future">
              <Card>
                <span className="pb-1 font-bold">{futureTitle}</span>
                {futureCompany}
              </Card>
              <Card>
                <Hr />
              </Card>
              <Card>
                <Image
                  src="https://media.giphy.com/media/aNqEFrYVnsS52/giphy.gif"
                  alt="keyboard cat"
                  width="255"
                  height="200"
                  priority={false}
                />
              </Card>
            </Column>
          )}
          <Column title="January 2021...">
            <Card>
              <span className="pb-1 font-bold">
                Senior Geospatial & Frontend Technical Lead
              </span>
              Kablamo
            </Card>
            <Card>
              <Hr />
            </Card>
            <Card>
              <FlexCenter>
                <Image
                  width={250}
                  height={300}
                  src="/kablamo-logo.png"
                  alt="Kablamo logo"
                />
              </FlexCenter>
            </Card>
            <Card>
              <div className="font-bold pb-3">✨Upgrade March 2022✨</div>
              <div className="pb-3">Tech Lead -{">"} Senior Tech Lead</div>
            </Card>
            <Card>
              Duties:
              <Spacer />
              - Host the fortnightly frontend catchup where we discuss emerging
              frontend technology and trends and showcase frontend work our team
              has achieved.
              <Spacer />
              - Mentor frontend developers to reach their full potential
              <Spacer />
              - Consult on the geospatial projects
              <Spacer />
              - Build prototypes for client tenders
              <Spacer />
              - Get developers excited about 3D visualisations and geospatial
              applications
              <Spacer />
              - Build out and manage our geospatial knowledge base
              <Spacer />
              - Architect and pitch solutions to clients during the sales cycle
              and development cycle
              <Spacer />
              - Interview candidates for our frontend team
              <Spacer />- Work with clients during engagements to make sure
              we&apos;re delivering on their needs
            </Card>
          </Column>
          <Column title="2016-December 2020">
            <div className="pt-3">
              <Card>
                <div className="pb-1 font-bold">
                  <div>Senior Software Engineer /</div>
                  <div>(Engineering) Head of Visualiser</div>
                </div>
                Propeller Aero
              </Card>
              <Card>
                <Hr />
              </Card>
              <Card>
                Duties:
                <Spacer />
                - Build and maintain 3D drone mapping visualisation tool
                leveraging React, Redux and CesiumJS
                <Spacer />
                - Build and maintain the backend service written in Koa serving
                both REST and GraphQL endpoints
                <Spacer />
                - Mentor junior developers on software best practices and run
                workshops on the technologies and methodologies we use such as
                React, Redux, Node, Koa, Express, TDD.
                <Spacer />
                - Scrum master for a small team of developers
                <Spacer />
                - Write and maintain webpack and CI tooling and configuration to
                facilitate complex frontend builds
                <Spacer />
                - Deliver software demos to the company to showcase work
                delivered
                <Spacer />
                - Lead hiring interviews for Software Engineers, QA Engineers,
                Head of Engineering, Product Owners
                <Spacer />
                - Facilitate regular team retros and feedback sessions
                <Spacer />
                - Run One-to-Ones with the engineers
                <Spacer />
                - Champion best practices and standards
                <Spacer />
                - Visit customers to understand their needs and communicate back
                to the teams
                <Spacer />
                - Translate technical concepts to non-technical stakeholders
                <Spacer />
                - Build technical roadmaps and documentation to facilitate
                modernisation of an aging codebase
                <Spacer />
                - Build feature usage dashboards so we can make informed
                data-driven decisions
                <Spacer />
                - Write Infrastructure-as-Code using Terraform to generate the
                AWS cloud infrastructure to host our applications
                <Spacer />- Architect simple solutions to complex problems with
                the team of engineers
              </Card>
              <Card>
                Skills snapshot:
                <Spacer />
                - Expert level React
                <Spacer />
                - Expert level Node
                <Spacer />
                - Strong mapping skills
                <Spacer />
                <div className="ml-4">- CesiumJS</div>
                <Spacer />
                <div className="ml-4">- Resium</div>
                <Spacer />
                <div className="ml-4">- Leaflet</div>
                <Spacer />
                <div className="ml-4">- Mapbox</div>
                <Spacer />
                - Tech/Team Leading
                <Spacer />
                - Developer Experience
                <Spacer />
                - Agile ceremony facilitation
                <Spacer />
                - OKR planning
                <Spacer />
                - Mentoring
                <Spacer />- Stakeholder management
              </Card>
            </div>
          </Column>
          <Column title="2014-2016">
            <Card>
              <span className="pb-1 font-bold">Senior Software Engineer</span>
              Mi9/Channel 9
            </Card>
            <Card>
              <Hr />
            </Card>
            <Card>
              Duties:
              <Spacer />
              - Work as part of a scrum team to create and maintain the whole of
              Channel 9’s network of websites
              <Spacer />
              - Leading teams to deliver these websites
              <Spacer />
              - Set the technical direction of the teams to ensure we’re moving
              forward and taking advantage of best practices and new technology
              <Spacer />
              - Helped deliver the first webpack built website in the network
              and help transition away from gulp and grunt
              <Spacer />
              - Worked on the component library for Channel 9 to help share code
              across different codebases
              <Spacer />- Pushed for React adoption within the company and lead
              the team building yourmovies.com.au in React
            </Card>
          </Column>
          <Column title="2013-2014">
            <Card>
              <span className="pb-1 font-bold">Software Engineer</span>
              Pace International, Sydney office
            </Card>
            <Card>
              <Hr />
            </Card>
            <Card>
              Duties:
              <Spacer />
              - Work as part of a small remote team to deliver Foxtel iQ3 UI
              software written in HTML, CSS and JS
              <Spacer />
              - Deliver software demos to customer stakeholders
              <Spacer />
              - Work with other vendors to align on delivery and usage of APIs
              <Spacer />- Work with set top box hardware to diagnose and solve
              issues
            </Card>
          </Column>
          <Column title="2010-2013">
            <Card>
              <span className="pb-1 font-bold">Software Engineer</span>
              Asidua, Belfast
            </Card>
            <Card>
              <Hr />
            </Card>
            <Card>
              Duties:
              <Spacer />
              - Work as part of scrum teams on many projects across the business
              <Spacer />
              - Work onsite with customer teams to deliver software projects
              <Spacer />- Communicate progress with external stakeholders on
              behalf of the business
            </Card>
            <Card>
              Notable projects:
              <Spacer />
              - Built a testing framework from scratch for set top box hardware
              in Perl + HTML/CSS/JS
              <Spacer />
              - Rebuilt the BTVision set top box UI software with a focus on
              reducing memory footprint in JS
              <Spacer />- Worked on high speed communications ordering tool for
              well known telecommunications company in Java + Angular JS
            </Card>
          </Column>
          <Column title="2005-2010">
            <Card>
              <span className="pb-1 font-bold">
                Bachelors of Engineering in Computer Science
              </span>
              Queens University Belfast
            </Card>
            <Card>
              <Hr />
            </Card>
            <Card>
              <span className="pb-1 font-bold">Java Demonstrator</span>
              Queens University Belfast
            </Card>
            <Card>
              <Hr />
            </Card>
            <Card>
              <span className="pb-1 font-bold">Database Administrator</span>
              Central Services Agency Northern Ireland
            </Card>
          </Column>
        </div>
      </div>
    </>
  );
}

export default Resume;
