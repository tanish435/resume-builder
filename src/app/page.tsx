'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setResume } from '@/store/slices/resumeSlice';
import { setActiveTemplate } from '@/store/slices/templateSlice';
import { setStyle } from '@/store/slices/styleSlice';
import ResumeCanvas from '@/components/resume/ResumeCanvas';
import { Resume, Section, SectionType, PersonalInfoData, SummaryData } from '@/types/schema';

export default function Home() {
  const dispatch = useAppDispatch();

  // Initialize with sample data
  useEffect(() => {
    // Sample resume data
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
      createdAt: new Date(),
      updatedAt: new Date(),
      lastEditedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Dispatch to Redux store
    dispatch(setResume({ ...sampleResume, sections: sampleSections }));
    dispatch(setActiveTemplate('modern'));
    dispatch(setStyle(sampleResume.styleConfig));
  }, [dispatch]);

  return (
    <div className="w-full h-screen">
      <ResumeCanvas />
    </div>
  );
}
