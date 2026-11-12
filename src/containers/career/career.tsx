import "./career.scss";
import React, { useState } from "react";
import jobsData from "data/career_jobs.json";

interface careerProps {}

const Career: React.FC<careerProps> = () => {
  const [openJobs, setOpenJobs] = useState<number[]>([]);

  const toggleAccordion = (id: number) => {
    setOpenJobs((prev) =>
      prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]
    );
  };

  return (
    <div className="career">
      <div className="career__inner">
        <div className="career__content wrapper--tight">
          <h2 className="career__content-header">Career Opportunities</h2>

          {/* 1. Join Our Team */}
          <div className="career__content-block">
            <h2 className="career__content-headline">Join Our Team</h2>
            <p>
              At Platoon Aviation, we're always looking for talented individuals to join our team. We offer exciting opportunities in various fields related to private aviation.
            </p>
            <p>
              If you're passionate about aviation and want to be part of a dynamic and innovative company, we'd love to hear from you.
            </p>
          </div>

          {/* 2. Job Listings Accordions */}
          <div className="job-offers">
            {jobsData.map((job) => {
              const isOpen = openJobs.includes(job.id);
              return (
                <div className="job-offer" key={job.id} style={{ position: "relative" }}>
                  <h2
                    onClick={() => toggleAccordion(job.id)}
                    className="job-offer__title"
                    style={{ cursor: "pointer", marginTop: 25 }}
                  >
                    {(isOpen ? "− " : "+ ") + job.title}
                  </h2>
                  <div
                    className={`job-content ${isOpen ? "visible" : ""}`}
                    dangerouslySetInnerHTML={{ __html: job.html }}
                  />
                  <hr />
                </div>
              );
            })}
          </div>

          {/* 3. Why Work With Us */}
          <div className="career__content-block">
            <h2 className="career__content-headline">Why Work With Us</h2>
            <p>Working at Platoon Aviation offers numerous benefits, including:</p>
            <div>
              <ul>
                <li>Competitive salary and benefits package</li>
                <li>Opportunities for professional growth and development</li>
                <li>A dynamic and innovative work environment</li>
                <li>The chance to work with cutting-edge aviation technology</li>
              </ul>
            </div>
            <p>Join us in shaping the future of private aviation!</p>
          </div>

          {/* 4. About Us */}
          <div className="career__content-block">
            <h2 className="career__content-headline">About us</h2>
            <p>
              Founded in 2021, Platoon Aviation's vision is to become the market's leading charter operator, achieved by leveraging advanced technology, state-of-the-art aircraft, and our team's unparalleled expertise.
            </p>
            <p>
              In 2024 Platoon will operate 8 identical PC-24, which operate on a floating fleet model across Europe (i.e. the aircraft have no fixed home base). The PC-24 offers an unparalleled level of comfort for our passengers, coupled with exceptional performance capabilities and better luggage capacity.
            </p>
            <p>
              Operating on an ad hoc basis, Platoon does not offer a scheduled service but according to market trends and individual demand from clients. Platoon operates in a B2B style model, which means we work principally with brokers across the world, and this has enabled us to already become a recognized brand and airline on the market due to the higher volume of flights we are able to operate.
            </p>
            <p>
              Platoon is determined to set the new benchmark in private charter when it comes to service and experience, and truly make our guests feel at home in the sky when they fly Platoon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
