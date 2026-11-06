import React, { useEffect, useState, useRef } from 'react';

const FetchJobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openJobTitles, setOpenJobTitles] = useState<string[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let text = '';
        try {
          const response = await fetch('https://platoon-aviation.jobs.personio.de/xml?language=en');
          if (response.ok) {
            text = await response.text();
          }
        } catch (e) {
          // fallback to local cached jobs if CORS prevents direct browser fetch
        }
        if (!text) {
          const localResponse = await fetch('/personio-jobs.xml');
          text = await localResponse.text();
        }
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');
        const jobElements = xml.getElementsByTagName('position');

        const jobList = Array.from(jobElements).map((job) => {
          const jobDescriptions = job.getElementsByTagName('jobDescription');
          const descriptions = Array.from(jobDescriptions).map((desc) => ({
            name: desc.getElementsByTagName('name')[0]?.textContent,
            value: desc.getElementsByTagName('value')[0]?.textContent,
          }));

          const jobId = job.getElementsByTagName('id')[0]?.textContent;
          const applyUrl = jobId 
            ? `https://platoon-aviation.jobs.personio.de/job/${jobId}?language=en&display=en#apply`
            : null;

          return {
            title: job.getElementsByTagName('name')[0]?.textContent,
            office: job.getElementsByTagName('office')[0]?.textContent,
            department: job.getElementsByTagName('department')[0]?.textContent,
            recruitingCategory: job.getElementsByTagName('recruitingCategory')[0]?.textContent,
            applyUrl,
            descriptions,
          };
        });

        setJobs(jobList);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchJobs();
  }, []);

  const toggleAccordion = (title: string) => {
    setOpenJobTitles((prev) => {
      if (prev.includes(title)) {
        return prev.filter((jobTitle) => jobTitle !== title); // Remove if already open
      } else {
        return [...prev, title]; // Add to open titles
      }
    });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="job-offers">
      {jobs.map((job) => (
        <div className="job-offer" key={job.title} style={{ position: 'relative' }}>
          <h2
            ref={(el) => (titleRefs.current[job.title] = el)}
            onClick={() => toggleAccordion(job.title)}
            style={{ cursor: 'pointer', marginTop: '25px' }}
          >
            {openJobTitles.includes(job.title) ? '−' : '+'} {/* Toggle icon */}
            {job.title}
          </h2>
          <div className={`job-content ${openJobTitles.includes(job.title) ? 'visible' : ''}`}>
            {job.descriptions.map((desc: { name: string; value: string }, descIndex: number) => (
              <div key={descIndex}>
                <h4>{desc.name}</h4>
                <div dangerouslySetInnerHTML={{ __html: desc.value }} />
              </div>
            ))}
            {job.applyUrl && (
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="apply-button">
                Apply Now
              </a>
            )}
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default FetchJobs;
