
import React from 'react';

const iconProps = {
  className: "w-6 h-6",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "square" as const, // Changed from round
  strokeLinejoin: "miter" as const, // Changed from round
};

export const SettingsIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const SunIcon: React.FC = () => <svg {...iconProps}><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>;
export const CloudIcon: React.FC = () => <svg {...iconProps}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>;
export const RainIcon: React.FC = () => <svg {...iconProps}><path d="M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>;
export const SnowIcon: React.FC = () => <svg {...iconProps}><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><path d="M8 16h.01M8 20h.01M12 18h.01M12 22h.01M16 16h.01M16 20h.01"></path></svg>;
export const WindIcon: React.FC = () => <svg {...iconProps}><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path></svg>;
export const StormIcon: React.FC = () => <svg {...iconProps}><path d="M21 4H3a2 2 0 0 0-2 2v7.01a2 2 0 0 0 .14 1.77 2 2 0 0 0 .5 1.05L6 18h12l2.35-2.17a2 2 0 0 0 .5-1.05 2 2 0 0 0 .14-1.77V6a2 2 0 0 0-2-2zm-3 5h-2l-1 4h4l-1-4z"></path></svg>;
export const PartlyCloudyIcon: React.FC = () => <svg {...iconProps}><path d="M12 4.5a5.5 5.5 0 1 1 5.5 5.5h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>;
export const FogIcon: React.FC = () => <svg {...iconProps}><path d="M2 12h20M7 12V9.5a2.5 2.5 0 1 1 5 0V12m-5 4h10M4 16h1m14 0h1"></path></svg>;
export const XIcon: React.FC<{className?: string}> = ({ className }) => <svg {...iconProps} className={className || iconProps.className}><path d="M18 6 6 18M6 6l12 12"></path></svg>;
export const PlusIcon: React.FC<{className?: string}> = ({ className }) => <svg {...iconProps} className={className || iconProps.className}><path d="M12 5v14M5 12h14"></path></svg>;
export const TrashIcon: React.FC<{className?: string}> = ({ className }) => <svg {...iconProps} className={className || iconProps.className}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
export const ShuffleIcon: React.FC<{className?: string}> = ({ className }) => <svg {...iconProps} className={className || iconProps.className}><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l5 6M4 4l5 5"></path></svg>;
export const UploadIcon: React.FC<{className?: string}> = ({ className }) => <svg {...iconProps} className={className || iconProps.className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"></path></svg>;
export const ChevronLeftIcon: React.FC<{className?: string}> = ({ className }) => <svg {...iconProps} className={className || iconProps.className}><path d="m15 18-6-6 6-6"></path></svg>;
export const ChevronRightIcon: React.FC<{className?: string}> = ({ className }) => <svg {...iconProps} className={className || iconProps.className}><path d="m9 18 6-6-6-6"></path></svg>;
export const ZenIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg {...iconProps} className={className || iconProps.className}>
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zM12 18a6 6 0 1 1 6-6 6 6 0 0 1-6 6z"></path>
    </svg>
);
export const LightbulbIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path d="M9 18h6M12 18V22M5.6 15a6.5 6.5 0 1 1 12.8 0h0a5 5 0 0 1-10.8 0h0Z"></path>
  </svg>
);
export const CalendarIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <rect x="3" y="4" width="18" height="18"></rect>
    <path d="M16 2v4M8 2v4M3 10h18"></path>
  </svg>
);
export const ListIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"></path>
  </svg>
);
export const SearchIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);
export const GlobeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);
export const LinkIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);
export const EditIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className || iconProps.className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);
