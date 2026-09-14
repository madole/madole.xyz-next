import * as React from "react";
import { differenceInCalendarYears } from "date-fns";
import { resumeData } from "../../data/resumeData";

/*
 * A conventional resume rendered from the same structured data as the board.
 *
 * The board is a Trello pastiche - horizontally scrolling columns of cards -
 * which prints as a clipped, chrome-heavy mess. This renders the same data
 * as the document a reader expects, and the print stylesheet swaps which of
 * the two is visible.
 *
 * It is in the DOM at all times rather than opened in a new window so that
 * "print to PDF" works from the page the user is already on, and so the
 * markup is server-rendered and indexable.
 */

const Section = (props: {
  title: string;
  children: React.ReactNode;
}): React.ReactElement => (
  <section className="print-section">
    <h2 className="mb-3 border-b border-neutral-300 pb-1 text-[11pt] font-bold uppercase tracking-[0.12em] text-neutral-700">
      {props.title}
    </h2>
    {props.children}
  </section>
);

const Bullets = (props: {
  items: Array<{
    text: string;
    subItems?: string[];
    /** Rendered as a comma-separated line rather than nested bullets. */
    inlineSubItems?: string[];
  }>;
}): React.ReactElement => (
  <ul className="ml-4 list-disc space-y-0.5">
    {props.items.map((item, index) => (
      <li key={index}>
        {item.text}
        {item.inlineSubItems?.length ? (
          <span className="text-neutral-600">
            {" "}
            — {item.inlineSubItems.join(", ")}
          </span>
        ) : null}
        {item.subItems?.length ? (
          <ul className="ml-4 list-[circle] space-y-0.5">
            {item.subItems.map((sub, subIndex) => (
              <li key={subIndex}>{sub}</li>
            ))}
          </ul>
        ) : null}
      </li>
    ))}
  </ul>
);

export const PrintableResume = (): React.ReactElement => {
  const { aboutMe, achievements, experience, education } = resumeData;

  const hours = new Intl.NumberFormat().format(
    differenceInCalendarYears(
      new Date(),
      new Date(aboutMe.engineeringExperience.startDate)
    ) * aboutMe.engineeringExperience.hoursPerYear
  );

  return (
    <article className="printable-resume mx-auto max-w-[720px] bg-white p-10 text-[10pt] leading-relaxed text-neutral-900">
      <header className="mb-6">
        <h1 className="text-[24pt] font-bold leading-tight tracking-tight">
          Andrew McDowell
        </h1>
        <p className="mt-1 text-[11pt] text-neutral-600">
          {experience[0]?.title} &middot; {experience[0]?.company}
        </p>
        <p className="mt-2 text-[9pt] text-neutral-600">
          {aboutMe.socialMedia.items
            .map((item) => item.link.text)
            .concat("madole.xyz")
            .join("  ·  ")}
        </p>
      </header>

      <Section title="Profile">
        <p>
          Software engineer with approximately {hours} hours of engineering
          experience, specialising in geospatial and 3D web applications and
          the teams that build them.
        </p>
      </Section>

      <Section title="Experience">
        <div className="space-y-4">
          {experience.map((role) => (
            <div key={role.period} className="print-entry">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-bold">
                  {role.title}
                  {role.company ? (
                    <span className="font-normal text-neutral-600">
                      {" "}
                      &middot; {role.company}
                    </span>
                  ) : null}
                </h3>
                <span className="shrink-0 text-[9pt] text-neutral-600">
                  {role.period}
                </span>
              </div>

              {role.upgrades?.length ? (
                <p className="mt-0.5 text-[9pt] italic text-neutral-600">
                  {role.upgrades
                    .map((u) => `${u.date}: ${u.from} → ${u.to}`)
                    .join("  ·  ")}
                </p>
              ) : null}

              {role.duties?.length ? (
                <div className="mt-1.5">
                  <Bullets items={role.duties.map((text) => ({ text }))} />
                </div>
              ) : null}

              {role.experience?.length ? (
                <div className="mt-2">
                  <div className="print-subhead font-semibold">Selected work</div>
                  <Bullets
                    items={role.experience.map((item) => ({
                      text: item.link
                        ? `${item.text} (${item.link.text})`
                        : item.text,
                      /*
                        Sub-items here are technology lists rather than prose,
                        so they read better as one line than as a bullet each.
                      */
                      inlineSubItems: item.subItems,
                    }))}
                  />
                </div>
              ) : null}

              {role.notableProjects?.length ? (
                <div className="mt-1.5">
                  <div className="print-subhead font-semibold">Notable projects</div>
                  <Bullets items={role.notableProjects} />
                </div>
              ) : null}

              {role.skills?.length ? (
                <div className="mt-2">
                  <div className="print-subhead font-semibold">Skills</div>
                  <Bullets
                    items={role.skills.map((skill) => ({
                      text: skill.text,
                      inlineSubItems: skill.subItems,
                    }))}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Certifications & achievements">
        <ul className="space-y-1">
          {achievements.map((achievement) => (
            <li key={achievement.id} className="flex justify-between gap-4">
              <span>
                <span className="font-semibold">{achievement.title}</span>
                {achievement.description ? ` — ${achievement.description}` : ""}
              </span>
              <span className="shrink-0 text-[9pt] text-neutral-600">
                {achievement.date}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Education">
        <div className="space-y-3">
          {education.map((entry) => (
            /*
              The period belongs to the group rather than to each item - the
              data nests several roles under one span of years, so printing
              it against every line reads as three identical dates.
            */
            <div key={entry.period}>
              <div className="mb-1 text-[9pt] text-neutral-600">
                {entry.period}
              </div>
              <div className="space-y-0.5">
                {entry.items.map((item) => (
                  <div key={item.title}>
                    <span className="font-semibold">{item.title}</span>
                    <span className="text-neutral-600">
                      {" "}
                      &middot; {item.institution}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={aboutMe.technologies.title}>
        <div className="space-y-1">
          {aboutMe.technologies.categories.map((category) => (
            <div key={category.name} className="flex gap-2">
              <span className="w-28 shrink-0 font-semibold">
                {category.name}
              </span>
              <span className="text-neutral-700">
                {category.items.join(", ")}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title={aboutMe.hobbies.title}>
        <p className="text-neutral-700">
          {aboutMe.hobbies.items.map((item) => item.text).join("  ·  ")}
        </p>
      </Section>
    </article>
  );
};

export default PrintableResume;
