// TourSteps.js
type JoyrideStep = {
  target: string;            // CSS selector of the element to highlight (required)
  content: React.ReactNode;  // Tooltip content (required)
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center'; // optional, default 'bottom'
  title?: React.ReactNode;   // Optional title for tooltip
  disableBeacon?: boolean;   // true to prevent beacon (highlight pulse) from showing
  hideBackButton?: boolean;  // hides "Back" button for this step
  spotlightPadding?: number; // padding around the element to highlight
  styles?: {                 // override styles for this step
    [key: string]: any;
  };
  isFixed?: boolean;         // if tooltip should be fixed in viewport
  placementBeacon?: string;  // position for the beacon
  floaterProps?: {           // advanced: props for Popper.js floating tooltip
    [key: string]: any;
  };
};
export const steps: JoyrideStep[] = [
  {
    target: '.theme-button', // CSS selector of element
    content: 'Toggle theme between dark mode and light mode.',
    disableBeacon: true,
  },
  {
    target: '.submenu-button',
    content: 'Click here to manage your profile and categories',
    placement: 'right',
  },
];