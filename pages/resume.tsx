import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import FlexCenter from "../components/FlexCenter";
import Card, { Hr, Spacer } from "../components/resume/Card";
import CardDialog from "../components/resume/CardDialog";
import Column from "../components/resume/Column";
import Header from "../components/resume/Header";
import { differenceInCalendarYears } from "date-fns";
import { resumeData } from "../data/resumeData";

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

  const [activeModal, setActiveModal] = useState<
    "hobbies" | "social" | "tech" | null
  >(null);

  // New state for lightbox
  const [openAchievement, setOpenAchievement] = useState<
    null | "lightning" | "spectral" | "airquality"
  >(null);

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

  const renderExperienceSection = (
    experience: (typeof resumeData.experience)[0]
  ) => (
    <Column key={experience.period} title={experience.period}>
      <Card>
        <span className="pb-1 font-bold">{experience.title}</span>
        {experience.company}
      </Card>
      <Card>
        <Hr />
      </Card>
      {experience.logo && (
        <Card>
          <FlexCenter>
            <Image
              width={experience.logo.width}
              height={experience.logo.height}
              src={experience.logo.src}
              alt={experience.logo.alt}
            />
          </FlexCenter>
        </Card>
      )}
      {experience.upgrades &&
        experience.upgrades.map((upgrade, index) => (
          <Card key={index}>
            <div className="font-bold pb-3">✨Upgrade {upgrade.date}✨</div>
            <div className="pb-3">
              {upgrade.from} -{">"} {upgrade.to}
            </div>
          </Card>
        ))}
      {experience.duties && (
        <Card>
          Duties:
          <Spacer />
          {experience.duties.map((duty, index) => (
            <div key={index}>
              - {duty}
              <Spacer />
            </div>
          ))}
        </Card>
      )}
      {experience.experience && (
        <Card>
          Experience:
          <Spacer />
          {experience.experience.map((exp, index) => (
            <div key={index}>
              - {exp.text}
              {exp.link && (
                <>
                  {" "}
                  <a
                    href={exp.link.url}
                    target="_blank"
                    className="text-blue-800"
                  >
                    {exp.link.text}
                  </a>
                </>
              )}
              {exp.subItems && (
                <ul className="ml-4">
                  {exp.subItems.map((item, itemIndex) => (
                    <li key={itemIndex}>- {item}</li>
                  ))}
                </ul>
              )}
              <Spacer />
            </div>
          ))}
        </Card>
      )}
      {experience.skills && (
        <Card>
          Skills snapshot:
          <Spacer />
          {experience.skills.map((skill, index) => (
            <div key={index}>
              - {skill.text}
              {skill.subItems && (
                <div className="ml-4">
                  {skill.subItems.map((item, itemIndex) => (
                    <div key={itemIndex}>- {item}</div>
                  ))}
                </div>
              )}
              <Spacer />
            </div>
          ))}
        </Card>
      )}
      {experience.notableProjects && (
        <Card>
          Notable projects:
          <Spacer />
          {experience.notableProjects.map((project, index) => (
            <div key={index}>
              - {project.text}
              <Spacer />
            </div>
          ))}
        </Card>
      )}
    </Column>
  );

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
                  differenceInCalendarYears(
                    new Date(),
                    new Date(resumeData.aboutMe.engineeringExperience.startDate)
                  ) * resumeData.aboutMe.engineeringExperience.hoursPerYear
                )}{" "}
                hours
              </div>
            </Card>
            <Card
              onClick={() => {
                setActiveModal("hobbies");
              }}
              labels={[{ text: "Clickable", color: "#61bd4f" }]}
            >
              {resumeData.aboutMe.hobbies.title}
              <CardDialog
                open={activeModal === "hobbies"}
                onClose={() => {
                  setActiveModal(null);
                }}
                title={resumeData.aboutMe.hobbies.title}
                columnName="About Me"
                date="6th Oct 2020 at 20:10"
              >
                <ul className="list-disc">
                  {resumeData.aboutMe.hobbies.items.map((item, index) => (
                    <li key={index} className="pb-2">
                      {item.text}
                      {item.link && (
                        <>
                          -{" "}
                          <a
                            className="text-blue-800 underline hover:text-blue-600"
                            href={item.link.url}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            &nbsp;{item.link.text}
                          </a>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </CardDialog>
            </Card>
            <Card
              onClick={() => {
                setActiveModal("social");
              }}
              labels={[{ text: "Clickable", color: "#61bd4f" }]}
            >
              {resumeData.aboutMe.socialMedia.title}
              <CardDialog
                open={activeModal === "social"}
                onClose={() => {
                  setActiveModal(null);
                }}
                title={resumeData.aboutMe.socialMedia.title}
                columnName="About Me"
                date="6th Oct 2020 at 20:20"
              >
                <ul className="list-disc">
                  {resumeData.aboutMe.socialMedia.items.map((item, index) => (
                    <li key={index} className="pb-2">
                      {item.label} - &nbsp;
                      <a
                        href={item.link.url}
                        className="text-blue-800 underline hover:text-blue-600"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardDialog>
            </Card>
            <Card
              onClick={() => {
                setActiveModal("tech");
              }}
              labels={[{ text: "Clickable", color: "#61bd4f" }]}
            >
              {resumeData.aboutMe.technologies.title}
              <CardDialog
                open={activeModal === "tech"}
                onClose={() => {
                  setActiveModal(null);
                }}
                title={resumeData.aboutMe.technologies.title}
                columnName="About Me"
                date="7th Oct 2020 at 20:20"
              >
                <div className="flex flex-col lg:flex-row justify-evenly w-full max-h-almost-full">
                  {resumeData.aboutMe.technologies.categories.map(
                    (category, index) => (
                      <div key={index} className="mb-4">
                        <div className="font-bold mb-4 text-xl -ml-5">
                          {category.name}
                        </div>
                        <ul className="list-disc">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="pb-2">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </CardDialog>
            </Card>
          </Column>
          <Column title="Achievements">
            {resumeData.achievements.map((achievement) => (
              <Card key={achievement.id}>
                <div className="pb-1 font-bold">
                  {achievement.date}: {achievement.title}
                </div>
                <div>{achievement.description}</div>
                <FlexCenter>
                  <Image
                    width={achievement.image.width}
                    height={achievement.image.height}
                    src={achievement.image.src}
                    alt={achievement.image.alt}
                    priority={true}
                    className="cursor-pointer"
                    onClick={() =>
                      setOpenAchievement(
                        achievement.id as
                          | "lightning"
                          | "spectral"
                          | "airquality"
                      )
                    }
                  />
                </FlexCenter>
              </Card>
            ))}
            {/* Lightbox Dialog for Achievements */}
            <CardDialog
              open={openAchievement !== null}
              onClose={() => setOpenAchievement(null)}
              title={
                openAchievement
                  ? `NASA ARSET: ${resumeData.achievements
                      .find((a) => a.id === openAchievement)
                      ?.description.split(" ")
                      .slice(-2)
                      .join(" ")} Certificate`
                  : ""
              }
              columnName="Achievements"
              date=""
            >
              {openAchievement && (
                <FlexCenter>
                  <Image
                    width={
                      resumeData.achievements.find(
                        (a) => a.id === openAchievement
                      )?.lightboxImage.width || 600
                    }
                    height={
                      resumeData.achievements.find(
                        (a) => a.id === openAchievement
                      )?.lightboxImage.height || 800
                    }
                    src={
                      resumeData.achievements.find(
                        (a) => a.id === openAchievement
                      )?.image.src || ""
                    }
                    alt={
                      resumeData.achievements.find(
                        (a) => a.id === openAchievement
                      )?.image.alt || ""
                    }
                    priority={true}
                  />
                </FlexCenter>
              )}
            </CardDialog>
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
          <Column title={resumeData.experience[0].period}>
            <Card>
              <span className="pb-1 font-bold">
                {resumeData.experience[0].title}
              </span>
              {resumeData.experience[0].company}
            </Card>
            <Card>
              <Hr />
            </Card>
            {resumeData.experience[0].logo && (
              <Card>
                <FlexCenter>
                  <Image
                    width={resumeData.experience[0].logo.width}
                    height={resumeData.experience[0].logo.height}
                    src={resumeData.experience[0].logo.src}
                    alt={resumeData.experience[0].logo.alt}
                  />
                </FlexCenter>
              </Card>
            )}
            {resumeData.experience[0].upgrades &&
              resumeData.experience[0].upgrades.map((upgrade, index) => (
                <Card key={index}>
                  <div className="font-bold pb-3">
                    ✨Upgrade {upgrade.date}✨
                  </div>
                  <div className="pb-3">
                    {upgrade.from ? upgrade.from + " ->" : ""} {upgrade.to}
                  </div>
                </Card>
              ))}
            {resumeData.experience[0].duties && (
              <Card>
                Duties:
                <Spacer />
                {resumeData.experience[0].duties.map((duty, index) => (
                  <div key={index}>
                    - {duty}
                    <Spacer />
                  </div>
                ))}
              </Card>
            )}
            {resumeData.experience[0].experience && (
              <Card>
                Experience:
                <Spacer />
                {resumeData.experience[0].experience.map((exp, index) => (
                  <div key={index}>
                    - {exp.text}
                    {exp.link && (
                      <>
                        {" "}
                        <a
                          href={exp.link.url}
                          target="_blank"
                          className="text-blue-800"
                        >
                          {exp.link.text}
                        </a>
                      </>
                    )}
                    {exp.subItems && (
                      <ul className="ml-4">
                        {exp.subItems.map((item, itemIndex) => (
                          <li key={itemIndex}>- {item}</li>
                        ))}
                      </ul>
                    )}
                    <Spacer />
                  </div>
                ))}
              </Card>
            )}
          </Column>
          {resumeData.experience.slice(1).map(renderExperienceSection)}
          {resumeData.education.map((education) => (
            <Column key={education.period} title={education.period}>
              {education.items.map((item, index) => (
                <div key={index}>
                  <Card>
                    <span className="pb-1 font-bold">{item.title}</span>
                    {item.institution}
                  </Card>
                  {index < education.items.length - 1 && (
                    <Card>
                      <Hr />
                    </Card>
                  )}
                </div>
              ))}
            </Column>
          ))}
        </div>
      </div>
    </>
  );
}

export default Resume;
