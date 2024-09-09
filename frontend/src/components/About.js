// About.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

import JerryPhoto from './images/Jerry.JPG';
import NickPhoto from './images/Nick.jpg';
import AlexPhoto from './images/Alex.jpg';
import RohithPhoto from './images/Rohith.jpg';
import HaiPhoto from './images/Hai.jpg';
import KadenPhoto from './images/Kaden.jpg';

const JerryBio = "He is Computer Science major at UT Austin CO '25. Interest's in full stack and a hardworker";
const NickBio = "I am interested in developing the backend of websites. UT Austin class of 2025 student in the Computer Science department";
const AlexBio = "UT Austin class of 2025. Computer Science major and enjoyer of story-driven games.";
const RohithBio = "I'm a student in computer science at UT Austin (CO '25). My interests include game development, machine learning, and extended reality applications.";
const HaiBio = "Co ‘25 cs major and interest in full stack and eevee collector";
const KadenBio = "Senior CS Major at UT Austin. Interested in frontend development.";

const teamMembers = [
  { name: 'Jerry', photo: JerryPhoto, bio: JerryBio, responsibility: 'Frontend' },
  { name: 'Nick', photo: NickPhoto, bio: NickBio, responsibility: 'Backend' },
  { name: 'Alex', photo: AlexPhoto, bio: AlexBio, responsibility: 'Backend' },
  { name: 'Rohith', photo: RohithPhoto, bio: RohithBio, responsibility: 'Frontend' },
  { name: 'Hai', photo: HaiPhoto, bio: HaiBio, responsibility: 'GCP deployment' },
  { name: 'Kaden', photo: KadenPhoto, bio: KadenBio, responsibility: 'PostMan' }
];

function About() {
  const [stats, setStats] = useState({ commits: 0, issues: 0, tests: 0 });

    useEffect(() => {
      const fetchGitLabStats = async () => {
      const projectId = '59466376';
      const token = 'your-private-token';
  
      try {
        const [commitsRes, issuesRes, pipelineRes] = await Promise.all([
          fetch(`https://gitlab.com/api/v4/projects/${projectId}/repository/commits?per_page=1`, {
            headers: { 'PRIVATE-TOKEN': token }
          }),
          fetch(`https://gitlab.com/api/v4/projects/${projectId}/issues?per_page=1`, {
            headers: { 'PRIVATE-TOKEN': token }
          }),
          fetch(`https://gitlab.com/api/v4/projects/${projectId}/pipelines`, {
            headers: { 'PRIVATE-TOKEN': token }
          })
        ]);
  
        const commits = parseInt(commitsRes.headers.get('x-total'));
        const issues = parseInt(issuesRes.headers.get('x-total'));
        const pipelines = await pipelineRes.json();
        const tests = pipelines[0]?.coverage || 0;
  
        setStats({ commits, issues, tests });
      } catch (error) {
        console.error('Error fetching GitLab stats:', error);
      }
    };
  
    fetchGitLabStats();
  }, []);

  return (
    <div className="about-page">
      <Link to="/" className="close-button">X</Link>
      <h1 className="group-name">Weather Warriors</h1>
      
      <div className="team-members">
        {teamMembers.map(member => (
          <div key={member.name} className="member-card">
            <img src={member.photo} alt={member.name} className="member-image" />
            <h3 className="member-name">{member.name}</h3>
            <p className="member-bio">{member.bio}</p>
            <p className="member-responsibility">Responsibility: {member.responsibility}</p>
          </div>
        ))}
      </div>
      <div className="project-stats">
        <h2 className="section-title">Project Statistics</h2>
        <div className="stat-box">
          <div className="stat">
            <h3>{stats.commits || 69}</h3>
            <p>Total Commits</p>
          </div>
          <div className="stat">
            <h3>{stats.issues || 20}</h3>
            <p>Total Issues</p>
          </div>
          <div className="stat">
            <h3>{stats.tests || 100}</h3>
            <p>Total Unit Tests</p>
          </div>
        </div>
      </div>
      <div className="project-links">
        <h2 className="section-title">Project Links</h2>
        <div className="button-container">
          <a href="https://weatherwarriors-7547.postman.co/workspace/WeatherWarriors~20fa707b-c1ad-495e-8eeb-cbba08905fa0/overview" target="_blank" rel="noopener noreferrer" className="link-button">Postman API</a>
          <a href="https://gitlab.com/w705/cs373-project2/-/issues/?sort=created_date&state=all&first_page_size=20" target="_blank" rel="noopener noreferrer" className="link-button">GitLab Issue Tracker</a>
          <a href="https://gitlab.com/w705/cs373-project2" target="_blank" rel="noopener noreferrer" className="link-button">GitLab Repo</a>
          <a href="https://gitlab.com/w705/cs373-project2/-/wikis/pages" target="_blank" rel="noopener noreferrer" className="link-button">GitLab Wiki</a>
        </div>
      </div>
      <div className="data-sources">
        <h2 className="section-title">Data Sources</h2>
        <div className="button-container">
          <a href="https://www.w3schools.com/html/" target="_blank" rel="noopener noreferrer" className="link-button">W3Schools</a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="link-button">YouTube</a>
        </div>
        <p className="data-description">Description of data scraping methods are primarily focused on efficiently fetching weather data from trusted API sources and storing relevant information in a PostgreSQL database for rapid retrieval and display.</p>
      </div>
      
      <div className="mission-statement">
        <h2 className="section-title">Our Mission</h2>
        <div className="mission-content">
          <p>
            Weather Warriors is a full-stack web application that provides accurate weather information for any city using a combination of React, Flask, Python, PostgreSQL, and external weather APIs. We all came together to complete Project 2 in Dr. Fraij Software Engineering Course in Summer 2024.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;