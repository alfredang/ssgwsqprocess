/**
 * app.js — Shared data and utilities for the SSG WSQ Process Guide
 */

const WSQ_STEPS = [
  {
    id: 1,
    title: 'Course Dashboards',
    file: 'assets/pdfs/1-course-dashboards.pdf',
    description: 'Overview of course management dashboards and key metrics',
    icon: '\u{1F4CA}'
  },
  {
    id: 2,
    title: 'Course Applications',
    file: 'assets/pdfs/2-course-applications.pdf',
    description: 'Managing and processing course applications',
    icon: '\u{1F4DD}'
  },
  {
    id: 3,
    title: 'Course Runs',
    file: 'assets/pdfs/3-course-runs.pdf',
    description: 'Setting up and administering course runs',
    icon: '\u{1F4C5}'
  },
  {
    id: 4,
    title: 'Grant Calculator',
    file: 'assets/pdfs/4-grant-calculator.pdf',
    description: 'Calculating eligible training grants',
    icon: '\u{1F4B0}'
  },
  {
    id: 5,
    title: 'Trainee Enrolment',
    file: 'assets/pdfs/5-trainee-enrolment.pdf',
    description: 'Enrolling trainees into approved courses',
    icon: '\u{1F464}'
  },
  {
    id: 6,
    title: 'Attendance',
    file: 'assets/pdfs/6-attendance.pdf',
    description: 'Recording and managing trainee attendance',
    icon: '\u2705'
  },
  {
    id: 7,
    title: 'Assessments',
    file: 'assets/pdfs/7-assessments.pdf',
    description: 'Conducting assessments and recording results',
    icon: '\u{1F4CB}'
  },
  {
    id: 8,
    title: 'Grants',
    file: 'assets/pdfs/8-grants.pdf',
    description: 'Applying for and managing training grants',
    icon: '\u{1F3E6}'
  },
  {
    id: 9,
    title: 'Claims',
    file: 'assets/pdfs/9-claims.pdf',
    description: 'Submitting and tracking grant claims',
    icon: '\u{1F4E4}'
  },
  {
    id: 10,
    title: 'Outcome Submission',
    file: 'assets/pdfs/10-outcome-submission.pdf',
    description: 'Submitting training outcomes and competency results',
    icon: '\u{1F3AF}'
  },
  {
    id: 11,
    title: 'Financial Transactions',
    file: 'assets/pdfs/11-financial-transactions.pdf',
    description: 'Viewing and managing financial transactions',
    icon: '\u{1F4B3}'
  },
  {
    id: 12,
    title: 'Refunds',
    file: 'assets/pdfs/12-refunds.pdf',
    description: 'Processing refund requests and adjustments',
    icon: '\u{1F504}'
  },
  {
    id: 13,
    title: 'Certificates',
    file: 'assets/pdfs/13-certificates.pdf',
    description: 'Generating and issuing training certificates',
    icon: '\u{1F4DC}'
  }
];

/**
 * Set active nav link based on current page
 */
function initNavbar() {
  const path = window.location.pathname;
  document.querySelectorAll('.navbar-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (path.endsWith(href) || (href === 'index.html' && (path.endsWith('/') || path.endsWith('index.html')))) {
      link.classList.add('active');
    }
  });
}

/**
 * Stagger animation for elements
 */
function animateElements(selector, delay = 60) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.animationDelay = `${i * delay}ms`;
    el.classList.add('animate-in');
  });
}

/**
 * Save last viewed step to localStorage
 */
function saveLastStep(stepId) {
  try {
    localStorage.setItem('wsq_last_step', stepId);
  } catch (e) { /* localStorage unavailable */ }
}

/**
 * Get last viewed step from localStorage
 */
function getLastStep() {
  try {
    return parseInt(localStorage.getItem('wsq_last_step'), 10) || null;
  } catch (e) {
    return null;
  }
}

document.addEventListener('DOMContentLoaded', initNavbar);
