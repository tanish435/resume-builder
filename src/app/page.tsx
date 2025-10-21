'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setResume } from '@/store/slices/resumeSlice';
import { setActiveTemplate } from '@/store/slices/templateSlice';
import { setStyle } from '@/store/slices/styleSlice';
import { initializeHistory } from '@/store/slices/historySlice';
import ResumeCanvas from '@/components/resume/ResumeCanvas';
import EditorPanel from '@/components/editor/EditorPanel';
import { Resume, Section, SectionType, PersonalInfoData, SummaryData, ExperienceData, EducationData } from '@/types/schema';

export default function Home() {
  const dispatch = useAppDispatch();
  const sections = useAppSelector((state) => state.resume.sections);
  const currentResume = useAppSelector((state) => state.resume.currentResume);
  const currentStyle = useAppSelector((state) => state.style.currentStyle);
  const activeTemplateId = useAppSelector((state) => state.template.activeTemplateId);
  const historyInitialized = useAppSelector((state) => state.history.present !== null);

  // Initialize with sample data
  useEffect(() => {
    // Sample resume data
    const now = new Date().toISOString();
    
    const sampleResume: Resume = {
      id: 'sample-resume-1',
      userId: 'user-1',
      title: 'My Professional Resume',
      templateId: 'modern',
      styleConfig: {
        primaryColor: '#2563eb',
        textColor: '#1f2937',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, sans-serif',
        fontSize: 14,
        lineHeight: 1.6,
        spacing: 'normal',
      },
      isPublic: false,
      createdAt: now,
      updatedAt: now,
      lastEditedAt: now,
    };

    // Sample sections
    const sampleSections: Section[] = [
      {
        id: 'section-1',
        resumeId: 'sample-resume-1',
        type: SectionType.PERSONAL_INFO,
        data: {
          fullName: 'John Doe',
          title: 'Full Stack Developer',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe',
          website: 'https://johndoe.dev',
        } as PersonalInfoData,
        order: 0,
        isVisible: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'section-2',
        resumeId: 'sample-resume-1',
        type: SectionType.SUMMARY,
        data: {
          content: 'Passionate Full Stack Developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies. Proven track record of delivering high-quality software solutions that drive business growth.',
        } as SummaryData,
        order: 1,
        isVisible: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'section-3',
        resumeId: 'sample-resume-1',
        type: SectionType.EXPERIENCE,
        data: {
          entries: [
            {
              id: 'exp-1',
              company: 'Tech Corp',
              position: 'Senior Software Engineer',
              location: 'San Francisco, CA',
              startDate: '01/2020',
              endDate: null,
              description: 'Leading development of cloud-based applications',
              highlights: ['Built scalable microservices', 'Improved performance by 40%'],
              technologies: ['React', 'Node.js', 'AWS'],
            },
          ],
        } as ExperienceData,
        order: 2,
        isVisible: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'section-4',
        resumeId: 'sample-resume-1',
        type: SectionType.EDUCATION,
        data: {
          entries: [
            {
              id: 'edu-1',
              institution: 'University of California',
              degree: 'Bachelor of Science',
              field: 'Computer Science',
              location: 'Berkeley, CA',
              startDate: '2015',
              endDate: '2019',
              gpa: '3.8',
              honors: 'Cum Laude',
              description: undefined,
              highlights: [],
            },
          ],
        } as EducationData,
        order: 3,
        isVisible: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // Dispatch to Redux store
    dispatch(setResume({ ...sampleResume, sections: sampleSections }));
    dispatch(setActiveTemplate('modern'));
    dispatch(setStyle(sampleResume.styleConfig));
  }, [dispatch]);

  // Initialize history after state is loaded
  useEffect(() => {
    // Only initialize history once we have data and haven't initialized yet
    if (sections.length > 0 && currentResume && !historyInitialized) {
      dispatch(initializeHistory({
        resume: currentResume,
        sections: sections,
        style: currentStyle,
        template: activeTemplateId,
      }));
    }
  }, [dispatch, sections, currentResume, currentStyle, activeTemplateId, historyInitialized]);

  return (
    <>
      <div className="flex w-full h-screen">
        {/* Left Sidebar - Editor Panel */}
        <EditorPanel />

        {/* Main Content - Resume Canvas */}
        <div className="flex-1">
          <ResumeCanvas />
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          /* Set up A4 page size with no margins */
          @page {
            size: A4 portrait;
            margin: 0;
          }

          /* Hide all non-printable elements */
          .no-print,
          .editor-panel {
            display: none !important;
          }

          /* Reset body and html for print */
          html,
          body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            overflow: visible;
            background: white;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          /* Main page container - remove flex layout for print */
          body > div:first-child {
            display: block !important;
          }

          /* Container adjustments */
          .relative.w-full.h-screen {
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .flex-1 {
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Canvas wrapper - remove padding and background */
          .bg-gray-100 {
            background: white !important;
            padding: 0 !important;
          }

          /* Center flex container for canvas */
          .flex.items-center.justify-center {
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: 0 !important;
          }

          /* Resume canvas - properly sized for A4 */
          #resume-canvas,
          .resume-canvas {
            width: 210mm !important;
            height: auto !important;
            min-height: 297mm !important;
            max-height: none !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-shadow: none !important;
            transform: none !important;
            transform-origin: unset !important;
            page-break-after: auto;
            page-break-inside: avoid;
            display: block !important;
            position: relative !important;
          }

          /* Template containers - override min-h-screen */
          .minimal-template,
          .modern-template,
          .professional-template,
          .creative-template {
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
          }

          /* Remove excessive padding from template inner containers */
          .minimal-template > div,
          .modern-template > div,
          .professional-template > div,
          .creative-template > div {
            padding: 15mm 20mm !important;
            margin: 0 !important;
          }

          /* Hide scrollbars */
          ::-webkit-scrollbar {
            display: none;
          }

          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          /* Ensure colors print correctly */
          * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          /* Preserve all flex layouts within resume */
          #resume-canvas .flex {
            display: flex !important;
          }

          #resume-canvas .flex-wrap {
            flex-wrap: wrap !important;
          }

          #resume-canvas .flex-col {
            flex-direction: column !important;
          }

          #resume-canvas .flex-row {
            flex-direction: row !important;
          }

          #resume-canvas .items-center {
            align-items: center !important;
          }

          #resume-canvas .items-start {
            align-items: flex-start !important;
          }

          #resume-canvas .justify-center {
            justify-content: center !important;
          }

          #resume-canvas .justify-between {
            justify-content: space-between !important;
          }

          #resume-canvas .justify-start {
            justify-content: flex-start !important;
          }

          /* Preserve gaps */
          #resume-canvas .gap-1 {
            gap: 0.25rem !important;
          }

          #resume-canvas .gap-2 {
            gap: 0.5rem !important;
          }

          #resume-canvas .gap-3 {
            gap: 0.75rem !important;
          }

          #resume-canvas .gap-4 {
            gap: 1rem !important;
          }

          /* Preserve inline-flex elements */
          #resume-canvas .inline-flex {
            display: inline-flex !important;
          }

          /* Ensure icons are visible and sized correctly */
          #resume-canvas svg {
            display: inline-block !important;
            flex-shrink: 0 !important;
          }

          /* Preserve link styling */
          #resume-canvas a {
            color: inherit !important;
            text-decoration: inherit !important;
          }

          #resume-canvas a.text-blue-600 {
            color: #2563eb !important;
          }

          #resume-canvas a:hover {
            text-decoration: none !important;
          }
        }
      `}</style>
    </>
  );
}
